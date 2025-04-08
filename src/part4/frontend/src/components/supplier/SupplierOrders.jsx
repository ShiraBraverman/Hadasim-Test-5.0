import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

export default function SupplierOrders({ supplier }) {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/api/suppliersOrders?supplierId=${supplier.id}`
      )
      .then((res) => setOrders(res.data))
      .catch(() => alert("שגיאה בטעינת ההזמנות"));

    axios
      .get("http://localhost:3001/api/suppliersOrdersItems")
      .then((res) => setOrderItems(res.data))
      .catch(() => alert("שגיאה בטעינת פריטי ההזמנות"));

    axios
      .get("http://localhost:3001/api/goods")
      .then((res) => setProducts(res.data))
      .catch(() => alert("שגיאה בטעינת המוצרים"));
  }, [supplier.id]);

  const getProductDetails = (id) => products.find((p) => p.id === id);

  const getItemsForOrder = (orderId) =>
    orderItems.filter((item) => item.orderId === orderId);

  const handleApprove = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/suppliersOrders/${orderId}`,
        {
          status: "אושרה",
        }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "אושרה" } : o))
      );
    } catch {
      alert("שגיאה באישור ההזמנה");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const priority = { "ממתין לאישור": 0, אושרה: 1, הושלמה: 2 };
    return priority[a.status] - priority[b.status];
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">ההזמנות שלך 🧾</Typography>
      {sortedOrders.length === 0 ? (
        <Typography>אין עדיין הזמנות</Typography>
      ) : (
        sortedOrders.map((order) => {
          const items = getItemsForOrder(order.id);
          return (
            <Paper key={order.id} sx={{ p: 2, mb: 4 }} elevation={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  הזמנה #{order.id} -{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                {order.status === "ממתין לאישור" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(order.id)}
                  >
                    אשר הזמנה
                  </Button>
                )}
              </Box>

              <Typography>סטטוס: {order.status}</Typography>
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>שם מוצר</TableCell>
                      <TableCell align="center">כמות</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((g, i) => {
                      const product = getProductDetails(g.goodId);
                      if (!product) return null;
                      return (
                        <TableRow key={i}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell align="center">{g.quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          );
        })
      )}
    </Box>
  );
}
