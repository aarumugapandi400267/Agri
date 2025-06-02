import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../api/adminapi";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    getAllTransactions(token).then(setTransactions);
  }, [token]);

  return (
    <div>
      <h2>Transactions & Payment Status</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Status</th><th>Amount</th></tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t._id}>
              <td>{t._id}</td>
              <td>{t.status}</td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}