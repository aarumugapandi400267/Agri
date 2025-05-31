// import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
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
function App() {
  return (
    <>
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
      </Routes>
    </>
  );
}

export default App;
