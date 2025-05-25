import * as API from "../../api/order"
import axios from 'axios';

export const placeOrder = (orderData) => async (dispatch) => {
    try {
        const { data } = await API.createOrder(orderData)
        return data;
    } catch (error) {
        console.error("Error place order:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const verifyPayment = (paymentData) => async (dispatch) => {
    try {
        const { data } = await axios.post("http://localhost:5000/api/payment/verify", paymentData, {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        console.error("Error verifying payment:", error.response?.data || error.message);
        throw error;
    }
};