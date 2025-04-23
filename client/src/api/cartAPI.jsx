import API from "./axiosConfig";

// Fetch cart from the database
export const fetchCartFromDB = async () => {
  try {
    const response = await API.get("/cart");
    return response.data; // Return the cart data from the response
  } catch (error) {
    console.error("Error fetching cart from database:", error.response?.data || error.message);
    throw error;
  }
};

// Save cart to the database
export const saveCartToDB = async (cart) => {
  try {
    const response = await API.post("/cart", { cart });
    return response.data; // Return the updated cart data from the response
  } catch (error) {
    console.error("Error saving cart to database:", error.response?.data || error.message);
    throw error;
  }
};