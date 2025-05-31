import API from "./axiosConfig";

export const createOrder = async (orderData) => {
	try {
		return await API.post("/payment/order",orderData);
	} catch (error) {
		console.error("Error creating order:", error.response?.data || error.message);
		throw error;
	}
}

export const getOrderById = async (orderId) => {
	try {
		return await API.get(`/orders/${orderId}`);
	} catch (error) {
		console.error("Error fetching order by ID:", error.response?.data || error.message);
		throw error;
	}
}