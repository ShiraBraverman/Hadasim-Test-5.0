import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

const ManagerPendingOrders = ({ orders }) => {
  const acceptOrder = (orderId) => {
    // לוגיקה לאישור הזמנה
    console.log(`Order ${orderId} accepted`);
  };

  return (
    <Grid container spacing={4} sx={{ mt: 4 }}>
      {orders
        .filter((order) => order.status === "בוצעה")
        .map((order, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">הזמנה מספר {order.id}</Typography>
                <Typography>סטטוס: {order.status}</Typography>
                <Typography>תאריך הזמנה: {order.orderDate}</Typography>
                <Button
                  variant="contained"
                  onClick={() => acceptOrder(order.id)}
                >
                  אישור קבלה
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export default ManagerPendingOrders;
