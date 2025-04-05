import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // יש להביא את ההזמנות מהשרת
    fetch('/api/orders')
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <Container>
      <Typography variant="h4">הזמנות קיימות</Typography>
      <List>
        {orders.map((order, index) => (
          <ListItem key={index}>
            <ListItemText primary={`הזמנה מספר ${order.id}`} secondary={`סטטוס: ${order.status}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default OrdersList;
