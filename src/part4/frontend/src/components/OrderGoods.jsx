import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const OrderGoods = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderStatus, setOrderStatus] = useState('');

  const handleOrder = (e) => {
    e.preventDefault();
    // לבצע הזמנה בשרת (השלב הבא)
    console.log(`הוזמן: ${product}, כמות: ${quantity}`);
    setOrderStatus('ההזמנה בוצעה בהצלחה');
  };

  return (
    <Container>
      <Typography variant="h4">הזמנת סחורה</Typography>
      <form onSubmit={handleOrder}>
        <TextField
          label="שם המוצר"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="כמות"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit">
          הזמנה
        </Button>
      </form>
      {orderStatus && <Typography variant="body1">{orderStatus}</Typography>}
    </Container>
  );
};

export default OrderGoods;
