import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import axios from "axios";
import ManagerGoodsList from "../components/manager/ManagerGoodsList.jsx";
import ManagerOrdersList from "../components/manager/ManagerOrdersList.jsx";
import ManagerPendingOrders from "../components/manager/ManagerPendingOrders.jsx";
import ManagerCompletedOrders from "../components/manager/ManagerCompletedOrders.jsx";

const ManagerHome = () => {
  const [goods, setGoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("goods");

  const fetchGoods = () => {
    axios
      .get("http://localhost:3001/api/goods")
      .then((response) => setGoods(response.data))
      .catch((error) => alert("Error fetching goods:", error));
  };

  const fetchOrders = () => {
    axios
      .get("http://localhost:3001/api/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => alert("Error fetching orders:", error));
  };
  useEffect(() => {
    fetchGoods();
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log(goods);
  }, [goods]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        דף מנהל
      </Typography>
      <Typography gutterBottom>
        כאן תוכלו לראות את כל המידע על המוצרים וההזמנות 📝
      </Typography>

      {/* כפתורים לעבור בין התצוגות */}
      <Button
        variant="contained"
        onClick={() => setView("goods")}
        sx={{ marginRight: 2 }}
      >
        ניהול סחורות
      </Button>
      <Button
        variant="contained"
        onClick={() => setView("orders")}
        sx={{ marginRight: 2 }}
      >
        ניהול הזמנות
      </Button>
      <Button
        variant="contained"
        onClick={() => setView("pendingOrders")}
        sx={{ marginRight: 2 }}
      >
        הזמנות בתהליך
      </Button>
      <Button
        variant="contained"
        onClick={() => setView("completedOrders")}
        sx={{ marginRight: 2 }}
      >
        הזמנות שהושלמו
      </Button>

      {/* הצגת התוכן לפי בחירת המשתמש */}
      {view === "goods" && (
        <ManagerGoodsList goods={goods} fetchGoods={fetchGoods} />
      )}
      {view === "orders" && (
        <ManagerOrdersList orders={orders} fetchOrders={fetchOrders} />
      )}
      {view === "pendingOrders" && (
        <ManagerPendingOrders orders={orders} fetchOrders={fetchOrders} />
      )}
      {view === "completedOrders" && (
        <ManagerCompletedOrders orders={orders} fetchOrders={fetchOrders} />
      )}
    </Container>
  );
};

export default ManagerHome;
