import React, { useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import SupplierGoods from "../components/supplier/SupplierGoods";
import SupplierOrders from "../components/supplier/SupplierOrders";

const SupplierHome = () => {
  const [view, setView] = useState(null);
  const supplierId = localStorage.getItem("supplierId");

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        דף ספק
      </Typography>
      <Typography gutterBottom>
        כאן תוכלו לעדכן את המוצרים שלכם ולהתעדכן בהזמנות 🛒
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setView("goods")}
        >
          ניהול מוצרים
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setView("orders")}
        >
          צפייה בהזמנות
        </Button>
      </Box>

      {/* הצגת הרכיב הרלוונטי לפי הבחירה */}
      {view === "goods" && <SupplierGoods supplierId={supplierId} />}
      {view === "orders" && <SupplierOrders />}
    </Container>
  );
};

export default SupplierHome;
