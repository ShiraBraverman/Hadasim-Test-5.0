import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Grid, Button, TextField } from "@mui/material";
import ProductItem from "../customer/ProductItem";

const SupplierGoods = ({ supplierId }) => {
  const [goods, setGoods] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    pricePerUnit: "",
    minQuantity: "",
  });

  useEffect(() => {
    // קריאה ל-API שמביא את המוצרים של הספק
    axios
      .get(`http://localhost:3001/api/suppliers/${supplierId}`)
      // .get(`http://localhost:3001/api/suppliers/1`)
      .then((response) => {
        if (response.data && response.data.goodsList) {
          setGoods(response.data.goodsList);
        }
      })
      .catch((error) => alert("Error fetching supplier goods:", error));
  }, [supplierId]);

  const handleAddProduct = () => {
    const updatedGoods = [...goods, { ...newProduct }];
    axios
      .put(`http://localhost:3001/suppliers/${supplierId}`, {
        goodsList: updatedGoods,
      })
      .then(() => {
        setGoods(updatedGoods); // עדכון המוצרים
        setNewProduct({ productName: "", pricePerUnit: "", minQuantity: "" }); // ריקון השדות
      })
      .catch((error) => alert("Error adding product:", error));
  };

  const handleDeleteProduct = (productName) => {
    const updatedGoods = goods.filter(
      (item) => item.productName !== productName
    );
    axios
      .put(`http://localhost:3001/api/suppliers/${supplierId}`, {
        goodsList: updatedGoods,
      })
      .then(() => setGoods(updatedGoods)) // עדכון המוצרים
      .catch((error) => alert("Error deleting product:", error));
  };

  const handleEditProduct = (productName, updatedProduct) => {
    const updatedGoods = goods.map((item) =>
      item.productName === productName ? updatedProduct : item
    );
    axios
      .put(`http://localhost:3001/api/suppliers/${supplierId}`, {
        goodsList: updatedGoods,
      })
      .then(() => setGoods(updatedGoods)) // עדכון המוצרים
      .catch((error) => alert("Error editing product:", error));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        רשימת המוצרים
      </Typography>

      <TextField
        label="שם המוצר"
        variant="outlined"
        fullWidth
        value={newProduct.productName}
        onChange={(e) =>
          setNewProduct({ ...newProduct, productName: e.target.value })
        }
        sx={{ mb: 2 }}
      />
      <TextField
        label="מחיר למוצר"
        variant="outlined"
        fullWidth
        value={newProduct.pricePerUnit}
        onChange={(e) =>
          setNewProduct({ ...newProduct, pricePerUnit: e.target.value })
        }
        sx={{ mb: 2 }}
      />
      <TextField
        label="כמות מינימלית"
        variant="outlined"
        fullWidth
        value={newProduct.minQuantity}
        onChange={(e) =>
          setNewProduct({ ...newProduct, minQuantity: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        sx={{ mb: 4 }}
      >
        הוסף מוצר חדש
      </Button>

      <Grid container spacing={4}>
        {goods.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <ProductItem
              product={item}
              onDelete={handleDeleteProduct}
              onEdit={handleEditProduct}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SupplierGoods;
