require("module-alias/register");
const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("src/part4/backend/db/db.json");

// Custom routes
const ordersRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const customerOrdersRoutes = require("./routes/customerOrderRoutes");
const imageUploadRoutes = require("./routes/imageRoutes");

server.use(express.json());

server.use(cors({
  origin: "http://localhost:5173"
}));

server.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// Custom logic routes
server.use("/api/auth", authRoutes); // POST /auth/login + register
server.use("/api/orders", ordersRoutes); // PUT /orders/:id/complete
server.use("/api/customerOrders", customerOrdersRoutes); //POST /customerOrders
server.use("/api", imageUploadRoutes);

// Default JSON Server routes (GET/POST for orders, goods, etc.)
server.use("/api", router); // Use this after custom routes

server.use("/uploads", express.static("src/part4/backend/uploads")); // גישה ישירה לתמונות

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
