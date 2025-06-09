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

export const getCustomerOrders = async () => {
	try {
		return await API.get("payment/orders/customer");
	} catch (error) {
		console.error("Error fetching customer orders:", error.response?.data || error.message);
		throw error;
	}
}

export const cancelOrder = async (orderId) => {
	try {
		return await API.put(`/payment/cancel`,{ orderId });
	} catch (error) {
		console.error("Error canceling order:", error.response?.data || error.message);
		throw error;
	}
}

export const approveCancelRequest = async (orderId) => {
	try {
		return await API.patch("/payment/cancel", { orderId });
	} catch (error) {
		console.error("Error requesting order cancellation:", error.response?.data || error.message);
		throw error;
	}
}

export const cancelItem = async (orderId, itemId) => {
	try {
		return await API.put("/payment/cancel-item", { orderId, productId:itemId });
	} catch (error) {
		console.error("Error canceling item:", error.response?.data || error.message);
		throw error;
	}
}

export const approveCancelItem = async (orderId, itemId) => {
	try {
		return await API.patch("/payment/cancel-item", { orderId, productId:itemId });
	} catch (error) {
		console.error("Error approving item cancellation:", error.response?.data || error.message);
		throw error;
	}
}

export const updateItemStatus = async (orderId, itemId, status) => {
	try {
		return await API.patch("/payment/item-status", { orderId, productId:itemId, status });
	} catch (error) {
		console.error("Error updating item status:", error.response?.data || error.message);
		throw error;
	}
}

export const createAccount = async (accountData) => {
	try {
		return await API.post("/payment/account/create", accountData);
	} catch (error) {
		console.error("Error creating account:", error.response?.data || error.message);
		throw error;
	}
}