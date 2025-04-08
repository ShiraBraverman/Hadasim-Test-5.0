import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import axios from "axios";
import GoodsList from "../components/manager/GoodsList.jsx";
import OrdersList from "../components/manager/OrdersList.jsx";
import MissingGoodsList from "../components/manager/MissingGoodsList.jsx";

const ManagerHome = () => {
  const [goods, setGoods] = useState([]);
  const [missingGoods, setMissingGoods] = useState([]);
  const [view, setView] = useState("goods");

  const fetchGoods = () => {
    axios
      .get("http://localhost:3001/api/goods")
      .then((response) => setGoods(response.data))
      .catch((error) => alert("Error fetching goods:", error));
  };

  const fetchMissingGoods = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/missingSuppliersOrders"
      );

      const enrichedGoods = await Promise.all(
        data.map(async (item) => {
          const goodResponse = await axios.get(
            `http://localhost:3001/api/goods/${item.goodId}`
          );
          return {
            ...item,
            goodName: goodResponse.data.productName,
            currentAmount: goodResponse.data.currentQuantity,
            minAmount: goodResponse.data.minQuantity,
            missingAmount:
              goodResponse.data.minQuantity - goodResponse.data.currentQuantity,
          };
        })
      );

      setMissingGoods(enrichedGoods);
    } catch (error) {
      alert("Error fetching missing goods:", error);
    }
  };

  useEffect(() => {
    fetchGoods();
    fetchMissingGoods();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          דף מנהל
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          כאן תוכלו לראות את כל המידע על המוצרים וההזמנות 📝
        </Typography>

        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Button
            variant={view === "goods" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setView("goods")}
          >
            ניהול סחורות
          </Button>
          <Button
            variant={view === "orders" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setView("orders")}
          >
            ניהול הזמנות
          </Button>
          <Button
            variant={view === "missing" ? "contained" : "outlined"}
            color="warning"
            onClick={() => setView("missing")}
          >
            מוצרים חסרי ספק ❗
          </Button>
        </Box>

        <Box>
          {view === "goods" && <GoodsList goods={goods} />}
          {view === "orders" && <OrdersList />}
          {view === "missing" && (
            <MissingGoodsList missingGoods={missingGoods} />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ManagerHome;
