const API_URL = "http://localhost:5000/api/admin";

export const adminLogin = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const getAllUsers = async (token) => {
  const res = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getDashboardKPIs = async (token) => {
  const res = await fetch(`${API_URL}/dashboard/kpis`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getAllProducts = async (token) => {
  const res = await fetch(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const approveProduct = async (id, approved, token) => {
  const res = await fetch(`${API_URL}/products/${id}/approve`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ approved }),
  });
  return res.json();
};

export const getAllTransactions = async (token) => {
  const res = await fetch("http://localhost:5000/api/admin/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getFarmerBankDetails = async (farmerId, token) => {
  const res = await fetch(`http://localhost:5000/api/admin/farmers/${farmerId}/bank`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export async function getAnalytics(token) {
  const res = await fetch("/api/admin/analytics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return res.json();
}

// Add similar functions for orders, categories, transactions, analytics, export, etc.