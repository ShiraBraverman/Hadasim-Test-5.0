import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";

const SupplierHome = () => {
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/supplier-goods")  // נתיב שמציג את המוצרים של הספק
      .then(response => setGoods(response.data))
      .catch(error => console.error("Error fetching supplier goods:", error));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>דף ספק</Typography>
      <Typography gutterBottom>כאן תוכלו לעדכן את המוצרים שאתם מספקים 🛒</Typography>

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
                {/* אפשרות לעדכון פרטי המוצר */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SupplierHome;
