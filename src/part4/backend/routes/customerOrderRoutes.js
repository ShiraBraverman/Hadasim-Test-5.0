const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DB_PATH = path.join(__dirname, "../db/db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  const { customerId, goods } = req.body;

  if (!customerId || !goods || !Array.isArray(goods)) {
    return res.status(400).json({ error: "נתונים חסרים או שגויים" });
  }

  const db = readDB();

  const customerExists = db.customers.find((c) => c.id === customerId);
  if (!customerExists) {
    return res.status(404).json({ error: "לקוח לא נמצא" });
  }

  // בדיקת תקינות מוצרים
  for (let item of goods) {
    const inventoryItem = db.goods.find((g) => g.id === item.goodId);
    if (!inventoryItem) {
      return res
        .status(404)
        .json({ error: `המוצר עם ID ${item.goodId} לא קיים במלאי` });
    }

    if (inventoryItem.currentQuantity < item.quantity) {
      return res.status(400).json({
        error: `אין מספיק כמות במלאי עבור המוצר ${inventoryItem.productName}. זמין: ${inventoryItem.currentQuantity}`,
      });
    }
  }

  const newOrder = {
    id: db.customerOrders.length + 1,
    customerId,
    goods,
    orderDate: new Date().toISOString().split("T")[0],
    status: "בוצעה",
  };

  db.customerOrders.push(newOrder);

  // עדכון מלאי
  goods.forEach((item) => {
    const inventoryItem = db.goods.find((g) => g.id === item.goodId);
    if (inventoryItem) {
      inventoryItem.currentQuantity -= item.quantity;
    }
  });

  // בדיקת צורך בהזמנה אוטומטית
  goods.forEach((item) => {
    const inventoryItem = db.goods.find((g) => g.id === item.goodId);
    if (
      inventoryItem &&
      inventoryItem.currentQuantity < inventoryItem.minStoreQuantity
    ) {
      let cheapestSupplier = null;
      let cheapestPrice = Infinity;

      db.suppliers.forEach((supplier) => {
        const found = supplier.goodsList.find((g) => g.goodId === item.goodId);
        if (found && found.pricePerUnit < cheapestPrice) {
          cheapestSupplier = supplier;
          cheapestPrice = found.pricePerUnit;
        }
      });

      if (cheapestSupplier) {
        const autoOrder = {
          id: db.orders.length + 1,
          supplierId: cheapestSupplier.id,
          status: "ממתין לאישור",
          goods: [
            {
              goodId: item.goodId,
              productName: inventoryItem.productName,
              quantity: cheapestSupplier.goodsList.find(
                (g) => g.goodId === item.goodId
              ).minQuantity,
            },
          ],
          orderDate: new Date().toISOString().split("T")[0],
          completedDate: null,
        };

        db.orders.push(autoOrder);
        console.log(`🔁 בוצעה הזמנה אוטומטית ל: ${inventoryItem.productName}`);
      } else {
        console.warn(`❗ אין ספק שמספק את המוצר: ${inventoryItem.productName}`);
      }
    }
  });

  writeDB(db);
  res.status(201).json(newOrder);
});

module.exports = router;
