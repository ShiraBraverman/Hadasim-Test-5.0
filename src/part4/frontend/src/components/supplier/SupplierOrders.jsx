import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const supplierId = localStorage.getItem("supplierId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const response = await axios.get(`/api/orders?supplierId=${supplierId}`);
        const response = await axios.get(`/api/orders?supplierId=1`);
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        alert("שגיאה בשליפת הזמנות:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supplierId]);

  const approveOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/approve`, { status: "בתהליך" });
      // עדכון מקומי של ההזמנה המאושרת
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "בתהליך" } : order
        )
      );
    } catch (error) {
      alert("שגיאה באישור הזמנה:", error);
    }
  };

  if (loading) return <p className="text-center mt-8">טוען הזמנות...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">ההזמנות שלך</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">אין הזמנות להצגה</p>
      ) : (
        <table className="w-full border border-gray-300 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr className="text-right">
              <th className="p-2">מספר הזמנה</th>
              <th className="p-2">תאריך</th>
              <th className="p-2">מוצרים</th>
              <th className="p-2">סטטוס</th>
              <th className="p-2">פעולה</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order._id}
                className="text-right border-t border-gray-200"
              >
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <ul className="list-disc pr-4">
                    {order.goods.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "חדשה"
                        ? "bg-blue-500"
                        : order.status === "בתהליך"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-2">
                  {order.status === "חדשה" ? (
                    <button
                      onClick={() => approveOrder(order._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      אשר הזמנה
                    </button>
                  ) : (
                    <span className="text-gray-400">אין פעולה</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SupplierOrders;
