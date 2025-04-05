import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";

const ManagerHome = () => {
  const [goods, setGoods] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/goods")
      .then(response => setGoods(response.data))
      .catch(error => console.error("Error fetching goods:", error));

    axios.get("http://localhost:3001/orders")
      .then(response => setOrders(response.data))
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>דף מנהל</Typography>
      <Typography gutterBottom>כאן תוכלו לראות את כל המידע על המוצרים וההזמנות 📝</Typography>

      {/* הצגת המוצרים */}
      <Grid container spacing={4}>
        {goods.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.imageUrl}
                alt={item.productName}
              />
              <CardContent>
                <Typography variant="h6">{item.productName}</Typography>
                <Typography>מחיר: ₪{item.pricePerUnit}</Typography>
                <Typography>כמות מינימלית: {item.minQuantity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* הצגת ההזמנות */}
      <Typography variant="h5" sx={{ mt: 4 }}>הזמנות</Typography>
      <Grid container spacing={4}>
        {orders.map((order, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">הזמנה מספר {order.id}</Typography>
                <Typography>סטטוס: {order.status}</Typography>
                <Typography>תאריך הזמנה: {order.orderDate}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManagerHome;
