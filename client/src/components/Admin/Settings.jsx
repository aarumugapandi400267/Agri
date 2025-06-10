import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchAllCategories,
  addCategory,
  editCategory,
  removeCategory,
  fetchAllRegions,
  addRegion,
  editRegion,
  removeRegion,
} from "../../actions/admin";

export default function Settings() {
  const dispatch = useDispatch();

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
    dispatch(fetchAllCategories()).then(setCategories);
    dispatch(fetchAllRegions()).then(setRegions);
  }, [dispatch]);

  // Category handlers
  const handleAddOrUpdateCat = async (e) => {
    e.preventDefault();
    if (editCatId) {
      await dispatch(editCategory(editCatId, { name: catName, description: catDesc }));
    } else {
      await dispatch(addCategory({ name: catName, description: catDesc }));
    }
    setCatName(""); setCatDesc(""); setEditCatId(null);
    dispatch(fetchAllCategories()).then(setCategories);
  };
  const handleEditCat = (cat) => {
    setEditCatId(cat._id); setCatName(cat.name); setCatDesc(cat.description || "");
  };
  const handleDeleteCat = async (id) => {
    await dispatch(removeCategory(id));
    dispatch(fetchAllCategories()).then(setCategories);
  };

  // Region handlers
  const handleAddOrUpdateReg = async (e) => {
    e.preventDefault();
    if (editRegId) {
      await dispatch(editRegion(editRegId, { name: regName, description: regDesc }));
    } else {
      await dispatch(addRegion({ name: regName, description: regDesc }));
    }
    setRegName(""); setRegDesc(""); setEditRegId(null);
    dispatch(fetchAllRegions()).then(setRegions);
  };
  const handleEditReg = (reg) => {
    setEditRegId(reg._id); setRegName(reg.name); setRegDesc(reg.description || "");
  };
  const handleDeleteReg = async (id) => {
    await dispatch(removeRegion(id));
    dispatch(fetchAllRegions()).then(setRegions);
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