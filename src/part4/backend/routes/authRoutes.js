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

console.log("📦 authRoutes loaded");

router.use((req, res, next) => {
  console.log(`📥 auth route hit: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/register", (req, res) => {
  const db = readDB();
  const { userType, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "יש לספק אימייל וסיסמה" });
  }

  if (userType === "supplier") {
    const {
      companyName,
      phoneNumber,
      representativeName,
      goodsList = [],
    } = req.body;

    if (db.suppliers.some((s) => s.email === email)) {
      return res.status(409).json({ message: "כתובת אימייל כבר קיימת" });
    }

    const newSupplier = {
      id: db.suppliers.length + 1,
      companyName,
      phoneNumber,
      representativeName,
      email,
      password,
      goodsList,
    };

    db.suppliers.push(newSupplier);
    writeDB(db);
    return res
      .status(201)
      .json({ message: "ספק נרשם בהצלחה", id: newSupplier.id });
  }

  if (userType === "customer") {
    const { name, phoneNumber } = req.body;

    if (db.customers.some((c) => c.email === email)) {
      return res.status(409).json({ message: "כתובת אימייל כבר קיימת" });
    }

    const newCustomer = {
      id: db.customers.length + 1,
      name,
      phoneNumber,
      email,
      password,
    };

    db.customers.push(newCustomer);
    writeDB(db);
    return res
      .status(201)
      .json({ message: "לקוח נרשם בהצלחה", id: newCustomer.id });
  }

  return res.status(400).json({ message: "סוג משתמש לא נתמך לרישום" });
});

router.post("/:userType/login", (req, res) => {
  console.log("🔐 התחברות:", req.params.userType, req.body);
  const db = readDB();
  const { email, password } = req.body;
  const { userType } = req.params;

  if (!email || !password) {
    return res.status(400).json({ message: "יש לספק אימייל וסיסמה" });
  }

  if (userType === "suppliers") {
    const supplier = db.suppliers.find(
      (s) => s.email === email && s.password === password
    );
    if (supplier)
      return res.json({ message: "ספק התחבר בהצלחה", id: supplier.id });
    return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
  }

  if (userType === "customers") {
    const customer = db.customers.find(
      (c) => c.email === email && c.password === password
    );
    if (customer)
      return res.json({ message: "לקוח התחבר בהצלחה", id: customer.id });
    return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
  }

  if (userType === "admin") {
    const { email: adminEmail, password: adminPassword } = db.admin;
    if (email === adminEmail && password === adminPassword)
      return res.json({ message: "מנהל התחבר בהצלחה" });
    return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
  }

  return res.status(400).json({ message: "סוג משתמש לא נתמך" });
});

module.exports = router;
