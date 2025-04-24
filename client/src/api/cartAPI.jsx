import API from "./axiosConfig";

// Fetch cart from the database
export const getCart = async () => {
	try {
		return await API.get("/cart");
	} catch (error) {
		console.error("Error fetching cart:", error.response?.data || error.message);
		throw error;
	}
}

export const deleteCartItem=async (id) => {
	try {
		return await API.delete("/cart/remove",{
			id:id
		})
	} catch (error) {
		console.error("Error delete cart item:", error.response?.data || error.message);
		throw error;
	}
}