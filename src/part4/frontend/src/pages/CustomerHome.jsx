import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const CustomerHome = () => {
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/goods") // עדכון לנתיב הנכון
      .then((response) => setGoods(response.data))
      .catch((error) => alert("Error fetching goods:", error));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        דף לקוח קצה
      </Typography>
      <Typography gutterBottom>
        כאן תוכלו לצפות בכל המוצרים ולהוסיף לעגלה 🎁
      </Typography>

      <Grid container spacing={4}>
        {goods.map((item, index) => (
          <Grid key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:3001${item.imageUrl}`} // עדכון כאן
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
    </Container>
  );
};

export default CustomerHome;
