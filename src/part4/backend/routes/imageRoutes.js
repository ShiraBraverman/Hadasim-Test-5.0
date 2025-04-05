const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// הגדרת מקום ושם הקובץ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/part4/backend/uploads"); // המיקום שבו נשמור את התמונות
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // מוודאים ששמות הקבצים יהיו ייחודיים
  }
});

const upload = multer({ storage });

// API להעלאת תמונה
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "לא התקבלה תמונה" });
  }

  // מחזירים את ה-URL של התמונה ששמרנו בשרת
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: imagePath });
});

module.exports = router;
