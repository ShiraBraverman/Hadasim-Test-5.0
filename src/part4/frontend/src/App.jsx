import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomerHome from "./pages/CustomerHome";
import SupplierHome from "./pages/SupplierHome";
import ManagerHome from "./pages/ManagerHome";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/:userType" element={<Login />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/supplier-home" element={<SupplierHome />} />
        <Route path="/manager-home" element={<ManagerHome />} />
      </Routes>
    </Router>
  );
};

export default App;
