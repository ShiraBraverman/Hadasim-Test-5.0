import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/HomePage";
import CustomerHome from "./pages/CustomerHome";
import SupplierHome from "./pages/SupplierHome";
import ManagerHome from "./pages/ManagerHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserProvider } from "./contest/UserContext";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login/:userType" element={<Login />} />
          <Route path="/register/:userType" element={<Register />} />
          <Route path="/customer-home" element={<CustomerHome />} />
          <Route path="/supplier-home" element={<SupplierHome />} />
          <Route path="/admin-home" element={<ManagerHome />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
