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

// רישום ספק חדש
router.post("/register", (req, res) => {
  const newSupplier = req.body;
  const db = readDB();

  db.suppliers.push(newSupplier);
  writeDB(db);
  res.status(201).json(newSupplier);
});

// התחברות ספק
router.post("/login", (req, res) => {
  const { companyName, representativeName } = req.body;
  const db = readDB();

  const supplier = db.suppliers.find(
    (s) => s.companyName === companyName && s.representativeName === representativeName
  );

  if (supplier) {
    res.json({ message: "התחברות מוצלחת", supplier });
  } else {
    res.status(401).json({ message: "הספק לא נמצא" });
  }
});

module.exports = router;
