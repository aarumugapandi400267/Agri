// import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/farmer/AuthPage";
import HomePage from "./components/Farmer/Home/Home";
import FarmerDashboard from "./components/Farmer/Dashboard/FarmerDashboard";
import LandingPage from "./components/Buyer/Landing/LandingPage";
import ProductDetail from "./components/Buyer/Product/ProductDetail";
import Razorpay from "./components/Buyer/Payment/PaymentPage";
import AccountVerification from "./components/Buyer/Payment/BankAccountValidation";
import OrderDetails from "./components/Farmer/Order/OrderDetails";
// import Analytics from './components/Admin/Components/Dashboard'
// import AddAccount from './components/Farmer/AddAccount/AddAccount'
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/Dashboard";
import UserManagement from "./components/Admin/UserManagement";
import ProductApproval from "./components/Admin/ProductApproval";
import Transactions from "./components/Admin/Transactions";
import FarmerBankDetails from "./components/Admin/FarmerBankDetails";
import Analytics from "./components/Admin/Analytics";
import ExportReports from "./components/Admin/ExportReports";
import Settings from "./components/Admin/Settings";
import AdminLayout from "./components/Layout/AdminLayout";
import Sidebar from "./components/Layout/Sidebar";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function RequireAdmin({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" />;
}

function App() {
  // Example user and logout handler
  const adminUser = { name: "Admin" }; // Replace with real user data
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Routes>
        <Route path="/auth" element={<AuthPage />}></Route>
        <Route path="/dashboard" element={<FarmerDashboard />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/home" element={<LandingPage />}></Route>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/farmer/orders/:orderId" element={<OrderDetails />} />
        
        {/* <Route path='/add-business-account' element={<AddAccount/>}/> */}
        <Route path="/payment" element={<Razorpay />}></Route>
        <Route
          path="/account-verification"
          element={<AccountVerification />}
        ></Route>
        {/* <Route path='/admindash' element={<Analytics/>}></Route> */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <AdminLayout user={adminUser} onLogout={handleLogout}>
                <AdminDashboard />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route path="/admin/users" element={<RequireAdmin><UserManagement /></RequireAdmin>} />
        <Route path="/admin/products" element={<RequireAdmin><ProductApproval /></RequireAdmin>} />
        <Route path="/admin/transactions" element={<RequireAdmin><Transactions /></RequireAdmin>} />
        <Route path="/admin/farmers/:id/bank" element={<RequireAdmin><FarmerBankDetails /></RequireAdmin>} />
        <Route path="/admin/analytics" element={<RequireAdmin><Analytics /></RequireAdmin>} />
        <Route path="/admin/export" element={<RequireAdmin><ExportReports /></RequireAdmin>} />
        <Route path="/admin/settings" element={<RequireAdmin><Settings /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;
