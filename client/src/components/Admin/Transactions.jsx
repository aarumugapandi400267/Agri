import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllTransactions } from "../../actions/admin"; // <-- Import the Redux action

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllTransactions()).then(setTransactions);
  }, [dispatch]);

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