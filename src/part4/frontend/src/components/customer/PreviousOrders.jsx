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
  Divider,
  Box,
} from "@mui/material";
import { useUser } from "../../contest/UserContext";

const PreviousOrders = () => {
  const [orders, setOrders] = useState([]);
  const [goodsData, setGoodsData] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:3001/api/customerOrders?customerId=${user.id}`)
      .then((res) => {
        setOrders(res.data);
        console.log("Orders:", res.data);
      })
      .catch(() => alert("שגיאה בטעינת הזמנות קודמות"));

    axios
      .get("http://localhost:3001/api/goods")
      .then((res) => {
        setGoodsData(res.data);
        console.log("Goods data:", res.data);
      })
      .catch((err) => {
        console.error("שגיאה בטעינת המוצרים", err);
        alert("שגיאה בטעינת המוצרים");
      });
  }, [user?.id]);

  const getGoodDetails = (id) => goodsData.find((g) => g.id === id);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        ההזמנות הקודמות שלי 🧾
      </Typography>

      {orders.length === 0 ? (
        <Typography>אין עדיין הזמנות קודמות</Typography>
      ) : (
        orders.map((order) => {
          const total = order.goods.reduce((sum, g) => {
            const good = getGoodDetails(g.goodId);
            return sum + (good ? g.quantity * good.pricePerUnit : 0);
          }, 0);

          return (
            <Paper key={order.id} sx={{ p: 2, mb: 4 }} elevation={3}>
              <Typography variant="h6" gutterBottom>
                הזמנה #{order.id} -{" "}
                {new Date(order.orderDate).toLocaleDateString()}
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>שם מוצר</TableCell>
                      <TableCell align="center">כמות</TableCell>
                      <TableCell align="center">מחיר ליח'</TableCell>
                      <TableCell align="center">סה"כ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.goods.map((g, i) => {
                      const good = getGoodDetails(g.goodId);
                      if (!good) return null;

                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {good.productName || `מוצר מספר ${g.goodId}`}
                          </TableCell>
                          <TableCell align="center">{g.quantity}</TableCell>
                          <TableCell align="center">
                            ₪{good.pricePerUnit}
                          </TableCell>
                          <TableCell align="center">
                            ₪{g.quantity * good.pricePerUnit}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <strong>סה"כ להזמנה:</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>₪{total}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default PreviousOrders;
