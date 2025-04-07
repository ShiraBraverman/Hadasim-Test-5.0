import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Collapse,
  Divider,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import axios from "axios";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, itemsRes, goodsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/suppliersOrders"),
        axios.get("http://localhost:3001/api/suppliersOrdersItems"),
        axios.get("http://localhost:3001/api/goods"),
      ]);

      const ordersData = ordersRes.data;
      const itemsData = itemsRes.data;
      const goodsData = goodsRes.data;

      const ordersWithDetails = ordersData.map((order) => {
        const orderItems = itemsData.filter(
          (item) => item.orderId === order.id
        );

        const products = orderItems.map((item) => {
          const good = goodsData.find((g) => g.id === item.goodId);
          return {
            name: good?.productName || "מוצר לא ידוע",
            quantity: item.quantity,
            totalPriceForProduct: (good?.pricePerUnit || 0) * item.quantity,
          };
        });

        const totalPrice = products.reduce(
          (sum, p) => sum + p.totalPriceForProduct,
          0
        );

        return {
          ...order,
          products,
          totalPrice,
        };
      });

      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("שגיאה בטעינת נתונים:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsCompleted = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/suppliersOrders/${orderId}`,
        {
          status: "הושלמה",
        }
      );
      fetchOrders();
    } catch (err) {
      alert("שגיאה בעדכון ההזמנה");
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    const priority = { בוצעה: 0, אושרה: 1, הושלמה: 2 };
    return priority[a.status] - priority[b.status];
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "אושרה":
        return "primary";
      case "הושלמה":
        return "success";
      case "בוצעה":
        return "info";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        רשימת הזמנות מספקים 📋
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          אין הזמנות להצגה
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {sortedOrders.map((order) => {
            const totalProducts =
              order.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

            return (
              <Grid key={order.id} item xs={12} sm={6} md={4}>
                <Card
                  elevation={3}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                    height: "100%",
                  }}
                  onClick={() => toggleExpand(order.id)}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">הזמנה מס׳ {order.id}</Typography>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        תאריך
                      </Typography>
                      <Typography>
                        {new Date(order.orderDate).toLocaleDateString("he-IL")}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1, display: "flex", gap: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          סה"כ מוצרים
                        </Typography>
                        <Typography>{totalProducts}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          מחיר כולל
                        </Typography>
                        <Typography fontWeight="bold">
                          ₪{order.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        מזהה ספק
                      </Typography>
                      <Typography>{order.supplierId}</Typography>
                    </Box>

                    {order.status === "אושרה" && (
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsCompleted(order.id);
                          }}
                        >
                          סמן כבוצע ✓
                        </Button>
                      </Box>
                    )}

                    <Collapse in={expandedOrderId === order.id}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        פרטי ההזמנה:
                      </Typography>
                      {order.products && order.products.length > 0 ? (
                        <Box sx={{ mt: 1 }}>
                          {order.products.map((product, index) => (
                            <Box
                              key={index}
                              sx={{
                                mt: 1,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: "rgba(0,0,0,0.03)",
                              }}
                            >
                              <Typography>
                                <strong>מוצר:</strong> {product.name}
                              </Typography>
                              <Typography>
                                <strong>כמות:</strong> {product.quantity}
                              </Typography>
                              <Typography>
                                <strong>מחיר:</strong> ₪
                                {product.totalPriceForProduct.toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          אין פריטים
                        </Typography>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Paper>
  );
};

export default OrdersList;
