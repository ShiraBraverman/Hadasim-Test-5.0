const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DB_PATH = path.join(__dirname, "../db/db.json");

// helper to read & write DB
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  const { customerId, goods } = req.body;
  const db = readDB();

  const newOrder = {
    id: db.customerOrders.length + 1,
    customerId,
    goods,
    orderDate: new Date().toISOString().split("T")[0],
    status: "בוצעה"
  };

  db.customerOrders.push(newOrder);

  // Update inventory
  goods.forEach(item => {
    const inventoryItem = db.goods.find(g => g.productName === item.productName);
    if (inventoryItem) {
      inventoryItem.currentQuantity = (inventoryItem.currentQuantity || 0) - item.quantity;
    }
  });

  // Check for auto orders
  goods.forEach(item => {
    const inventoryItem = db.goods.find(g => g.productName === item.productName);
    if (inventoryItem && inventoryItem.currentQuantity < inventoryItem.minStoreQuantity) {
      // Find the cheapest supplier
      let cheapestSupplier = null;
      let cheapestPrice = Infinity;

      db.suppliers.forEach(supplier => {
        const found = supplier.goodsList.find(g => g.productName === item.productName);
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
              productName: item.productName,
              quantity: cheapestSupplier.goodsList.find(g => g.productName === item.productName).minQuantity
            }
          ],
          orderDate: new Date().toISOString().split("T")[0],
          completedDate: null
        };

        db.orders.push(autoOrder);
        console.log(`🔁 בוצעה הזמנה אוטומטית ל: ${item.productName}`);
      } else {
        console.warn(`❗ אין ספק שמספק את המוצר: ${item.productName}`);
      }
    }
  });

  writeDB(db);
  res.status(201).json(newOrder);
});

module.exports = router;
