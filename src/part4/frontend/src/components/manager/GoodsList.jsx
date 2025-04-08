import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const GoodsList = ({ goods, fetchGoods }) => {
  const [editedPrice, setEditedPrice] = useState("");
  const [editedMinQty, setEditedMinQty] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemMinQty, setNewItemMinQty] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemImage, setNewItemImage] = useState(null);

  const handleSave = () => {
    fetch(`http://localhost:3001/api/goods/${selectedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...selectedItem,
        pricePerUnit: editedPrice,
        minQuantity: editedMinQty,
        currentQuantity: selectedItem.currentQuantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("עדכון הצליח:", data);
        setOpenEditDialog(false);
        fetchGoods();
      })
      .catch((error) => {
        alert("שגיאה בעדכון:", error);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/goods/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("מחיקה הצליחה:", data);
        fetchGoods();
      })
      .catch((error) => {
        alert("שגיאה במחיקה:", error);
      });
  };

  const handleImageUpload = (image) => {
    const formData = new FormData();
    formData.append("image", image);

    return fetch("http://localhost:3001/api/upload-image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => data.imageUrl)
      .catch((error) => {
        console.error("שגיאה בהעלאת התמונה:", error);
        throw error;
      });
  };

  const handleAddNewItem = async () => {
    try {
      let imageUrl = null;

      if (newItemImage) {
        imageUrl = await handleImageUpload(newItemImage);
      }

      const newItemData = {
        productName: newItemName,
        pricePerUnit: newItemPrice,
        minQuantity: newItemMinQty,
        currentQuantity: "0",
        imageUrl: imageUrl,
      };

      fetch("http://localhost:3001/api/goods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("הוספה הצליחה:", data);
          fetchGoods();
          setOpenAddDialog(false);
        })
        .catch((error) => {
          alert("שגיאה בהוספה:", error);
        });
    } catch (error) {
      alert("שגיאה בהעלאת התמונה:", error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenAddDialog(true)}
        sx={{ mb: 2 }}
      >
        הוסף פריט חדש
      </Button>
      <Grid container spacing={2} sx={{ mt: 4, width: "100%" }}>
        {goods.map((item, index) => (
          <Grid key={index} item xs={6} sm={4} md={2}>
            <Card
              sx={{
                height: 200,
                display: "flex",
                flexDirection: "column",
                padding: 2,
              }}
            >
              <Box
                component="img"
                src={`http://localhost:3001${item.imageUrl}`}
                alt={item.productName}
                sx={{
                  height: 80,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flexGrow: 1, paddingBottom: 0 }}>
                <Typography variant="h6" noWrap sx={{ fontSize: 14 }}>
                  {item.productName}
                </Typography>

                <Typography sx={{ fontSize: 12 }}>
                  מחיר: ₪{item.pricePerUnit}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  כמות מינימלית: {item.minQuantity}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  כמות נוכחית בחנות: {item.currentQuantity}
                </Typography>

                <Box display="flex" justifyContent="space-between" mt={1}>
                  <IconButton
                    onClick={() => {
                      setSelectedItem(item);
                      setEditedPrice(item.pricePerUnit);
                      setEditedMinQty(item.minQuantity);
                      setOpenEditDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>הוסף פריט חדש</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="שם המוצר"
            size="small"
            required
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="מחיר"
            size="small"
            required
            type="number"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="כמות מינימלית"
            size="small"
            required
            type="number"
            value={newItemMinQty}
            onChange={(e) => setNewItemMinQty(e.target.value)}
            sx={{ mt: 2 }}
          />

          <input
            type="file"
            onChange={(e) => setNewItemImage(e.target.files[0])} 
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            ביטול
          </Button>
          <Button
            onClick={handleAddNewItem}
            color="primary"
            variant="contained"
          >
            הוסף
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>עדכון פריט</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="מחיר"
            size="small"
            type="number"
            required
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="כמות מינימלית"
            size="small"
            type="number"
            required
            value={editedMinQty}
            onChange={(e) => setEditedMinQty(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="כמות נוכחית בחנות"
            size="small"
            type="number"
            value={selectedItem ? selectedItem.currentQuantity : ""}
            onChange={(e) =>
              setSelectedItem({
                ...selectedItem,
                currentQuantity: e.target.value,
              })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            ביטול
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GoodsList;
