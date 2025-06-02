import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/admin";
const token = localStorage.getItem("adminToken");

// Category helpers
async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function addCategory(name, description) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

async function updateCategory(id, name, description) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

async function deleteCategory(id) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Region helpers
async function fetchRegions() {
  const res = await fetch(`${API_URL}/regions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function addRegion(name, description) {
  const res = await fetch(`${API_URL}/regions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

async function updateRegion(id, name, description) {
  const res = await fetch(`${API_URL}/regions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
}

async function deleteRegion(id) {
  const res = await fetch(`${API_URL}/regions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export default function Settings() {
  // Categories state
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [editCatId, setEditCatId] = useState(null);

  // Regions state
  const [regions, setRegions] = useState([]);
  const [regName, setRegName] = useState("");
  const [regDesc, setRegDesc] = useState("");
  const [editRegId, setEditRegId] = useState(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchRegions().then(setRegions);
  }, []);

  // Category handlers
  const handleAddOrUpdateCat = async (e) => {
    e.preventDefault();
    if (editCatId) {
      await updateCategory(editCatId, catName, catDesc);
    } else {
      await addCategory(catName, catDesc);
    }
    setCatName(""); setCatDesc(""); setEditCatId(null);
    fetchCategories().then(setCategories);
  };
  const handleEditCat = (cat) => {
    setEditCatId(cat._id); setCatName(cat.name); setCatDesc(cat.description || "");
  };
  const handleDeleteCat = async (id) => {
    await deleteCategory(id);
    fetchCategories().then(setCategories);
  };

  // Region handlers
  const handleAddOrUpdateReg = async (e) => {
    e.preventDefault();
    if (editRegId) {
      await updateRegion(editRegId, regName, regDesc);
    } else {
      await addRegion(regName, regDesc);
    }
    setRegName(""); setRegDesc(""); setEditRegId(null);
    fetchRegions().then(setRegions);
  };
  const handleEditReg = (reg) => {
    setEditRegId(reg._id); setRegName(reg.name); setRegDesc(reg.description || "");
  };
  const handleDeleteReg = async (id) => {
    await deleteRegion(id);
    fetchRegions().then(setRegions);
  };

  return (
    <div>
      <h2>Admin Settings</h2>
      <h3>Categories</h3>
      <form onSubmit={handleAddOrUpdateCat}>
        <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Category Name" required />
        <input value={catDesc} onChange={e => setCatDesc(e.target.value)} placeholder="Description" />
        <button type="submit">{editCatId ? "Update" : "Add"}</button>
        {editCatId && <button onClick={() => { setEditCatId(null); setCatName(""); setCatDesc(""); }}>Cancel</button>}
      </form>
      <ul>
        {categories.map(cat => (
          <li key={cat._id}>
            <b>{cat.name}</b> - {cat.description}
            <button onClick={() => handleEditCat(cat)}>Edit</button>
            <button onClick={() => handleDeleteCat(cat._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Regions</h3>
      <form onSubmit={handleAddOrUpdateReg}>
        <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Region Name" required />
        <input value={regDesc} onChange={e => setRegDesc(e.target.value)} placeholder="Description" />
        <button type="submit">{editRegId ? "Update" : "Add"}</button>
        {editRegId && <button onClick={() => { setEditRegId(null); setRegName(""); setRegDesc(""); }}>Cancel</button>}
      </form>
      <ul>
        {regions.map(reg => (
          <li key={reg._id}>
            <b>{reg.name}</b> - {reg.description}
            <button onClick={() => handleEditReg(reg)}>Edit</button>
            <button onClick={() => handleDeleteReg(reg._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}