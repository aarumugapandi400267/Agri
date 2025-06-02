import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFarmerBankDetails } from "../../api/adminapi";

export default function FarmerBankDetails() {
  const { id } = useParams();
  const [bank, setBank] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    getFarmerBankDetails(id, token).then(setBank);
  }, [id, token]);

  if (!bank) return <div>Loading...</div>;

  return (
    <div>
      <h2>Farmer Bank Details</h2>
      <div>Account Holder: {bank.accountHolderName}</div>
      <div>Account Number: {bank.accountNumber}</div>
      <div>IFSC: {bank.ifsc}</div>
      <div>UPI ID: {bank.upiId}</div>
    </div>
  );
}