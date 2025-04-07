import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

export default function SupplierProducts({ supplier }) {
  const [products, setProducts] = useState([]);
  const [goodsList, setGoodsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/api/goods")
      .then((res) => setProducts(res.data))
      .catch(() => alert("שגיאה בטעינת כל המוצרים"));

    axios.get(`http://localhost:3001/api/suppliedProducts?supplierId=${supplier.id}`)
      .then((res) => setGoodsList(res.data))
      .catch(() => alert("שגיאה בטעינת רשימת המוצרים שלך"));
  }, [supplier.id]);

  const getProductDetails = (id) => products.find((p) => p.id === id);

  const handleEditClick = (id, price) => {
    setEditingId(id);
    setNewPrice(price);
  };

  const handleSaveClick = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/suppliedProducts/${id}`, {
        pricePerUnit: parseFloat(newPrice),
      });
      const updatedList = goodsList.map((item) =>
        item.id === id ? { ...item, pricePerUnit: parseFloat(newPrice) } : item
      );
      setGoodsList(updatedList);
      setEditingId(null);
    } catch {
      alert("שגיאה בעדכון המחיר");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/suppliedProducts/${id}`);
      setGoodsList(goodsList.filter((item) => item.id !== id));
    } catch {
      alert("שגיאה במחיקת המוצר");
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct || !newProductPrice) return;
    try {
      const res = await axios.post("http://localhost:3001/api/suppliedProducts", {
        supplierId: supplier.id,
        goodId: parseInt(newProduct),
        pricePerUnit: parseFloat(newProductPrice),
      });
      setGoodsList([...goodsList, res.data]);
      setNewProduct("");
      setNewProductPrice("");
    } catch {
      alert("שגיאה בהוספת מוצר חדש");
    }
  };

  const availableGoods = products.filter(
    (p) => !goodsList.some((g) => g.goodId === p.id)
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        המוצרים שאתה מספק 📦
      </Typography>

      {goodsList.length === 0 ? (
        <Typography>לא הוגדרו עדיין מוצרים</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם מוצר</TableCell>
                <TableCell align="center">מחיר ליח'</TableCell>
                <TableCell align="center">פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goodsList.map((item) => {
                const product = getProductDetails(item.goodId);
                if (!product) return null;

                return (
                  <TableRow key={item.id}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell align="center">
                      {editingId === item.id ? (
                        <TextField
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          type="number"
                          size="small"
                        />
                      ) : (
                        `₪${item.pricePerUnit}`
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {editingId === item.id ? (
                        <IconButton onClick={() => handleSaveClick(item.id)} color="primary">
                          <Save />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleEditClick(item.id, item.pricePerUnit)} color="primary">
                          <Edit />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete(item.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h6">הוסף מוצר חדש שאתה מספק</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <TextField
          select
          label="מוצר"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {availableGoods.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.productName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="מחיר ליח'"
          type="number"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleAddProduct}>
          ➕ הוסף
        </Button>
      </Box>
    </Box>
  );
}
