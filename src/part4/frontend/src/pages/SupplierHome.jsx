import { useEffect, useState } from "react";
import axios from "axios";
import SupplierDashboard from "../components/supplier/SupplierDashboard";
import SupplierProducts from "../components/supplier/SupplierProducts";
import SupplierOrders from "../components/supplier/SupplierOrders";
import { useUser } from "../contest/UserContext";
import LoadingScreen from "../components/common/LoadingScreen";

const SupplierHome = () => {
  const { user } = useUser();
  const [page, setPage] = useState("dashboard");
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:3001/api/suppliers/${user.id}`)
      .then((res) => setSupplier(res.data))
      .catch(() => alert("שגיאה בטעינת נתוני הספק"));
  }, [user?.id]);

  if (!supplier) return <LoadingScreen message="טוען נתוני ספק..." />;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>שלום, {supplier.companyName}!</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setPage("dashboard")}>🏠 ראשי</button>
        <button onClick={() => setPage("products")}>📦 מוצרים</button>
        <button onClick={() => setPage("orders")}>🧾 הזמנות</button>
      </div>

      {page === "dashboard" && <SupplierDashboard supplier={supplier} />}
      {page === "products" && <SupplierProducts supplier={supplier} />}
      {page === "orders" && <SupplierOrders supplier={supplier} />}
    </div>
  );
};

export default SupplierHome;
