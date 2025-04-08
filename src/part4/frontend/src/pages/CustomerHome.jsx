import React, { useState } from "react";
import { Button, Stack, Divider } from "@mui/material";
import GoodList from "../components/customer/GoodList";
import CartSummary from "../components/customer/CartSummary";
import PreviousOrders from "../components/customer/PreviousOrders";

const CustomerHome = ({ customerId }) => {
  const [view, setView] = useState("products");
  const [cart, setCart] = useState([]);

  return (
    <div style={{ padding: "20px" }}>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant={view === "products" ? "contained" : "outlined"} onClick={() => setView("products")}>
          🛍 מוצרים
        </Button>
        <Button variant={view === "summary" ? "contained" : "outlined"} onClick={() => setView("summary")}>
          📄 סיכום הזמנה
        </Button>
        <Button variant={view === "orders" ? "contained" : "outlined"} onClick={() => setView("orders")}>
          📦 ההזמנות שלי
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {view === "products" && <GoodList cart={cart} setCart={setCart} />}
      {view === "summary" && <CartSummary cart={cart} setCart={setCart} customerId={customerId} />}
      {view === "orders" && <PreviousOrders customerId={customerId} />}
    </div>
  );
};

export default CustomerHome;
