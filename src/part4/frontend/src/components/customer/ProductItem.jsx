import React from "react";
import { Button, Typography } from "@mui/material";

const ProductItem = ({ product, onDelete, onEdit }) => (
  <div>
    <Typography variant="h6">{product.productName}</Typography>
    <Typography>מחיר: ₪{product.pricePerUnit}</Typography>
    <Typography>כמות מינימלית: {product.minQuantity}</Typography>

    <Button variant="outlined" color="secondary" onClick={() => onEdit(product)} sx={{ mt: 1 }}>
      ערוך
    </Button>
    <Button variant="outlined" color="error" onClick={() => onDelete(product.productName)} sx={{ mt: 1, ml: 1 }}>
      מחק
    </Button>
  </div>
);

export default ProductItem;
