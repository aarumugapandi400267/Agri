import API from "./axiosConfig";

export const createOrder = async (orderData) => {
	try {
		return await API.post("/payment/order",orderData);
	} catch (error) {
		console.error("Error creating order:", error.response?.data || error.message);
		throw error;
	}
}