const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/part4/backend/uploads"); 
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); 
  }
});

const upload = multer({ storage });

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "לא התקבלה תמונה" });
  }
  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: imagePath });
});

module.exports = router;
