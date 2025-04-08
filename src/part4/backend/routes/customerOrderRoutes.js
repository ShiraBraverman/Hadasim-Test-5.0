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

  goods.forEach((item) => {
    const inventoryItem = db.goods.find((g) => g.id === item.goodId);
    if (inventoryItem) {
      inventoryItem.currentQuantity -= item.quantity;
    }
  });

  goods.forEach((item) => {
    console.log("item");
    console.log(item);
    const inventoryItem = db.goods.find((g) => g.id === item.goodId);
    if (
      inventoryItem &&
      inventoryItem.currentQuantity <= inventoryItem.minQuantity
    ) {
      let cheapestSupplier = null;
      let cheapestPrice = Infinity;

      db.suppliedProducts.forEach((supplierProduct) => {
        if (supplierProduct.goodId === item.goodId) {
          const supplier = db.suppliers.find(
            (s) => s.id === supplierProduct.supplierId
          );
          if (supplierProduct.pricePerUnit < cheapestPrice) {
            cheapestSupplier = supplier;
            cheapestPrice = supplierProduct.pricePerUnit;
          }
        }
      });

      if (cheapestSupplier) {
        const newOrderId = db.suppliersOrders.length + 1;

        const autoOrder = {
          id: newOrderId,
          supplierId: cheapestSupplier.id,
          status: "ממתין לאישור",
          orderDate: new Date().toISOString().split("T")[0],
          completedDate: null,
        };

        db.suppliersOrders.push(autoOrder);

        db.suppliersOrdersItems.push({
          id: db.suppliersOrdersItems.length + 1,
          orderId: newOrderId,
          goodId: item.goodId,
          quantity: inventoryItem.minQuantity,
        });

        console.log(`בוצעה הזמנה אוטומטית ל: ${inventoryItem.productName}`);
      } else {
        db.missingSuppliersOrders.push({
          id: db.missingSuppliersOrders.length + 1,
          goodId: item.goodId,
          createdDate: new Date().toISOString().split("T")[0],
        });
        console.warn(`אין ספק שמספק את המוצר: ${inventoryItem.productName}`);
      }
    }
  });

  writeDB(db);
  res.status(201).json(newOrder);
});

module.exports = router;
