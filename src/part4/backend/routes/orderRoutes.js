const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "../db/db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

// אישור הזמנה
router.put("/:id/complete", (req, res) => {
  const orderId = parseInt(req.params.id);
  const db = readDB();

  const order = db.orders.find((o) => o.id === orderId);

  if (order) {
    order.status = "הושלמה";
    writeDB(db);
    res.json({ message: "ההזמנה הושלמה" });
  } else {
    res.status(404).json({ message: "ההזמנה לא נמצאה" });
  }
});

module.exports = router;
