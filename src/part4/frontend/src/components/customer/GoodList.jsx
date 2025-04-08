import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const GoodList = ({ cart, setCart }) => {
  const [goods, setGoods] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/goods")
      .then((res) => setGoods(res.data))
      .catch((err) => alert("שגיאה בטעינת מוצרים"));
  }, []);

  useEffect(() => {
    console.log(goods);
  }, [goods]);

  const handleAddToCart = (item) => {
    const quantity = parseInt(quantities[item.id] || 0);
    if (quantity <= 0) {
      alert("יש לבחור כמות תקינה");
      return;
    }

    const exists = cart.find((p) => p.goodId === item.id);
    if (exists) {
      setCart(
        cart.map((p) =>
          p.goodId === item.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
    } else {
      setCart([...cart, { goodId: item.id, quantity }]);
    }

    setQuantities({ ...quantities, [item.id]: 0 });
  };

  return (
    <Grid container spacing={3}>
      {goods.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card>
            <CardMedia
              component="img"
              height="180"
              image={`http://localhost:3001${item.imageUrl}`}
              alt={item.productName}
            />
            <CardContent>
              <Typography variant="h6">{item.productName}</Typography>
              <Typography>מחיר: ₪{item.pricePerUnit}</Typography>
              <Typography>במלאי: {item.currentQuantity}</Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <IconButton
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [item.id]: Math.max(
                        1,
                        (parseInt(prev[item.id]) || 0) - 1
                      ),
                    }))
                  }
                  disabled={!quantities[item.id] || quantities[item.id] <= 1}
                >
                  <Remove />
                </IconButton>
                <Typography>{quantities[item.id] || 0}</Typography>
                <IconButton
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [item.id]: Math.min(
                        item.currentQuantity,
                        (parseInt(prev[item.id]) || 0) + 1
                      ),
                    }))
                  }
                  disabled={(quantities[item.id] || 0) >= item.currentQuantity}
                >
                  <Add />
                </IconButton>
              </div>

              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAddToCart(item)}
              >
                הוסף לעגלה
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default GoodList;
