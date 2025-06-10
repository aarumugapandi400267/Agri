import API from "./adminAxiosConfig";

// --- Auth ---
export const adminLogin = (formData) => API.post("/admin/login", formData);
export const adminRegister = (formData) => API.post("/admin/register", formData);

// --- Users ---
export const getAllUsers = () => API.get("/admin/users");
export const getUserById = (id) => API.get(`/admin/users/${id}`);
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// --- Products ---
export const getAllProducts = () => API.get("/admin/products");
export const createProduct = (data) => API.post("/admin/products", data);
export const updateProduct = (id, data) => API.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/admin/products/${id}`);

// --- Orders ---
export const getAllOrders = () => API.get("/admin/orders");
export const getOrderById = (id) => API.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, data) => API.put(`/admin/orders/${id}`, data);
export const deleteOrder = (id) => API.delete(`/admin/orders/${id}`);

// --- Categories ---
export const getAllCategories = () => API.get("/admin/categories");
export const createCategory = (data) => API.post("/admin/categories", data);
export const updateCategory = (id, data) => API.put(`/admin/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/admin/categories/${id}`);

// --- Regions ---
export const getAllRegions = () => API.get("/admin/regions");
export const createRegion = (data) => API.post("/admin/regions", data);
export const updateRegion = (id, data) => API.put(`/admin/regions/${id}`, data);
export const deleteRegion = (id) => API.delete(`/admin/regions/${id}`);

// --- Dashboard KPIs ---
export const getDashboardKPIs = () => API.get("/admin/dashboard/kpis");
// --- Admin Profile ---
export const getAdminProfile = () => API.get("/admin/profile");
export const updateAdminProfile = (data) => API.patch("/admin/profile", data);
export const updateAdminPassword = (data) => API.patch("/admin/profile/password", data);
// Add to e:\Agri\client\src\api\adminapi.jsx
export const getFarmerBankDetails = (id) => API.get(`/admin/farmers/${id}/bank`);
export const getAllTransactions = () => API.get("/admin/transactions");
export const getAnalytics = () => API.get("/admin/analytics");