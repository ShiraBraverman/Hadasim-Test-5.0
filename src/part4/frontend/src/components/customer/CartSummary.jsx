import React, { useEffect, useState } from "react";
import { Typography, Button, Divider, CircularProgress } from "@mui/material";
import axios from "axios";
import { useUser } from "../../contest/UserContext";

const CartSummary = ({ cart, setCart, customerId }) => {
  const { user } = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [responseOrder, setResponseOrder] = useState(null);
  const [goodsData, setGoodsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/goods")
      .then((res) => {
        setGoodsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("שגיאה בטעינת המוצרים", err);
        alert("שגיאה בטעינת המוצרים");
      });
  }, []);

  useEffect(() => {
    console.log("user");
    console.log(user);
    console.log("user.id " + user.id);
  }, []);

  const getGoodDetails = (id) => goodsData.find((g) => g.id === id);

  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("העגלה ריקה!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/customerOrders", {
        customerId: user.id,
        goods: cart,
      });

      setSubmitted(true);
      setResponseOrder(res.data);
      setCart([]);
    } catch (err) {
      alert(err?.response?.data?.error || "שגיאה בשליחת ההזמנה");
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const good = getGoodDetails(item.goodId);
      return sum + (good ? good.pricePerUnit * item.quantity : 0);
    }, 0);
  };

  if (submitted && responseOrder) {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          ההזמנה נשלחה בהצלחה ✅
        </Typography>
        <Typography>מספר הזמנה: {responseOrder.id}</Typography>
        <Typography>תאריך: {responseOrder.orderDate}</Typography>
        <Divider sx={{ my: 2 }} />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th align="right">שם המוצר</th>
              <th align="right">כמות</th>
              <th align="right">מחיר ליחידה</th>
              <th align="right">סה״כ</th>
            </tr>
          </thead>
          <tbody>
            {responseOrder.goods.map((g, idx) => {
              const good = getGoodDetails(g.goodId);
              return (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td align="right">{good?.productName || "מוצר"}</td>
                  <td align="right">{g.quantity}</td>
                  <td align="right">₪{good?.pricePerUnit || "?"}</td>
                  <td align="right">
                    ₪{(good?.pricePerUnit || 0) * g.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Typography variant="h6" align="right" sx={{ mt: 2 }}>
          סה״כ לתשלום: ₪{calculateTotal()}
        </Typography>
      </div>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        סיכום הזמנה
      </Typography>
      {cart.length === 0 ? (
        <Typography>העגלה ריקה כרגע 🛒</Typography>
      ) : (
        <>
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th align="right">שם המוצר</th>
                <th align="right">כמות</th>
                <th align="right">מחיר ליחידה</th>
                <th align="right">סה״כ</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => {
                const good = getGoodDetails(item.goodId);
                if (!good) return null;
                const total = good.pricePerUnit * item.quantity;
                return (
                  <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                    <td align="right">{good.productName}</td>
                    <td align="right">{item.quantity}</td>
                    <td align="right">₪{good.pricePerUnit}</td>
                    <td align="right">₪{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Typography variant="h6" align="right" sx={{ mt: 2 }}>
            סה״כ לתשלום: ₪{calculateTotal()}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" fullWidth onClick={handleOrder}>
            שלח הזמנה ✅
          </Button>
        </>
      )}
    </div>
  );
};

export default CartSummary;
