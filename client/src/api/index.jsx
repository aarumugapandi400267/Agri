import API from "./axiosConfig";

export const login = async (formData) => await API.post("/auth/login", formData);
export const register = async (formData) => await API.post("/auth/register", formData);

export const getProducts=async(farmer_id)=>await API.get("/auth/products")