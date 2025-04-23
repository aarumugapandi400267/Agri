import API from "./axiosConfig";

export const login = async (formData) => await API.post("/auth/login", formData);
export const register = async (formData) => await API.post("/auth/register", formData);

export const getUser=async()=>{return await API.get("/users/profile")}

export const updateUser=async (formData) => {
    try {
        return await API.put("/users/profile",formData)
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
        throw error; 
    }
}

export const getProducts = async () => {
    try {
        return await API.get("/products");
    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw error; 
    }
};

export const updateProductById = async(id, updatedProduct) =>{
    try {
        return await API.put(`/products/${id}`, updatedProduct); // Send updated product data

    } catch (error) {
        console.error("Product Update Error:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const createProduct=async(product)=>{
    try {
        return await API.post("/products",product)
    } catch (error) {
        console.error("Product Update Error:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

export const getProductsForCustomer=async () => {
    try {
        return await API.get("/products/fetch")
    } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw error; 
    }
}
