import * as api from "../api/adminapi";

// --- Auth ---
export const adminLogin = (formData) => async () => {
  const { data } = await api.adminLogin(formData);
  console.log(data);
  return data;
};
export const adminRegister = (formData) => async () => {
  const { data } = await api.adminRegister(formData);
  return data;
};

// --- Users ---
export const fetchAllUsers = () => async () => {
  const { data } = await api.getAllUsers();
  return data;
};
export const fetchUserById = (id) => async () => {
  const { data } = await api.getUserById(id);
  return data;
};
export const editUser = (id, userData) => async () => {
  const { data } = await api.updateUser(id, userData);
  return data;
};
export const removeUser = (id) => async () => {
  const { data } = await api.deleteUser(id);
  return data;
};

// --- Products ---
export const fetchAllProducts = () => async () => {
  const { data } = await api.getAllProducts();
  return data;
};
export const addProduct = (productData) => async () => {
  const { data } = await api.createProduct(productData);
  return data;
};
export const editProduct = (id, productData) => async () => {
  const { data } = await api.updateProduct(id, productData);
  return data;
};
export const removeProduct = (id) => async () => {
  const { data } = await api.deleteProduct(id);
  return data;
};

// --- Orders ---
export const fetchAllOrders = () => async () => {
  const { data } = await api.getAllOrders();
  return data;
};
export const fetchOrderById = (id) => async () => {
  const { data } = await api.getOrderById(id);
  return data;
};
export const editOrderStatus = (id, statusData) => async () => {
  const { data } = await api.updateOrderStatus(id, statusData);
  return data;
};
export const removeOrder = (id) => async () => {
  const { data } = await api.deleteOrder(id);
  return data;
};

// --- Categories ---
export const fetchAllCategories = () => async () => {
  const { data } = await api.getAllCategories();
  return data;
};
export const addCategory = (catData) => async () => {
  const { data } = await api.createCategory(catData);
  return data;
};
export const editCategory = (id, catData) => async () => {
  const { data } = await api.updateCategory(id, catData);
  return data;
};
export const removeCategory = (id) => async () => {
  const { data } = await api.deleteCategory(id);
  return data;
};

// --- Regions ---
export const fetchAllRegions = () => async () => {
  const { data } = await api.getAllRegions();
  return data;
};
export const addRegion = (regionData) => async () => {
  const { data } = await api.createRegion(regionData);
  return data;
};
export const editRegion = (id, regionData) => async () => {
  const { data } = await api.updateRegion(id, regionData);
  return data;
};
export const removeRegion = (id) => async () => {
  const { data } = await api.deleteRegion(id);
  return data;
};

// --- Dashboard KPIs ---
export const fetchDashboardKPIs = () => async () => {
  const { data } = await api.getDashboardKPIs();
  return data;
};

// --- Admin Profile ---
export const fetchAdminProfile = () => async () => {
  const { data } = await api.getAdminProfile();
  return data;
};

export const updateAdminProfile = (profileData) => async () => {
  const { data } = await api.updateAdminProfile(profileData);
  return data;
};

export const updateAdminPassword = (passwordData) => async () => {
  const { data } = await api.updateAdminPassword(passwordData);
  return data;
};

// --- Farmer Bank Details ---
export const fetchFarmerBankDetails = (id) => async () => {
  const { data } = await api.getFarmerBankDetails(id);
  return data;
};

// --- Transactions ---
export const fetchAllTransactions = () => async () => {
  const { data } = await api.getAllTransactions();
  return data;
};

// --- Analytics ---
export const fetchAnalytics = () => async () => {
  const { data } = await api.getAnalytics();
  return data;
};