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

export const addCartItem = async (id,quantity) => {
	try {
		return await API.post("/cart/add",{
			productId:id,quantity
		})
	} catch (error) {
		console.error("Error adding cart items:", error.response?.data || error.message);
		throw error;
	}
}

export const getProductsForCustomer = async () => {
	try {
		return await API.get("/products/fetch")
	} catch (error) {
		console.error("Error fetching products:", error.response?.data || error.message);
		throw error;
	}
}

export const deleteCartItem = async (id) => {
	try {
		return await API.delete("/cart/remove", {
			data: { productId: id },
		})
	} catch (error) {
		console.error("Error delete cart item:", error.response?.data || error.message);
		throw error;
	}
}

export const updateCartItem = async (productId, quantityChange) => {
	try {
		return await API.put("/cart/update", {
			productId: productId, quantityChange: quantityChange
		})
	} catch (error) {
		console.error("Error Updating cart item:", error.response?.data || error.message);
		throw error;
	}
}

export const clearCart=async () => {
	try {
		return await API.put("/cart/clear")
	} catch (error) {
		console.error("Error Clearing cart item:", error.response?.data || error.message);
		throw error;
	}
}