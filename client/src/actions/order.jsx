import * as api from '../api/order';
import { GETORDERBYID,FETCHCUSTOMERORDER } from '../constants/actionTypes';

export const getOrderById = (id) => async () => {
  try {
    const { data } = await api.getOrderById(id);
    return data;
  } catch (error) {
    console.error('Get Order by ID failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

export const getCustomerOrders = () => async (dispatch) => {
  try {
    const { data } = await api.getCustomerOrders();
    dispatch({
      type: FETCHCUSTOMERORDER,
      payload: data.orders,
    });
    return data.orders;
  } catch (error) {
    console.error('Get Customer Orders failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

export const cancelOrder = (orderId) => async () => {
  try {
    const { data } = await api.cancelOrder(orderId);
    return data;
  } catch (error) {
    console.error('Cancel Order failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

export const approveCancelRequest = (orderId) => async () => {
  try {
    const { data } = await api.approveCancelRequest(orderId);
    return data;
  } catch (error) {
    console.error('Approve Cancel Request failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

export const cancelItem = (orderId, itemId) => async () => {
  try {
    const { data } = await api.cancelItem(orderId, itemId);
    return data;
  } catch (error) {
    console.error('Cancel Item failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

export const approveCancelItem = (orderId, itemId) => async () => {
  try {
    const { data } = await api.approveCancelItem(orderId, itemId);
    return data;
  } catch (error) {
    console.error('Approve Cancel Item failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}

export const updateItemStatus = (orderId, itemId, status) => async () => {
  try {
    const { data } = await api.updateItemStatus(orderId, itemId, status);
    return data;
  } catch (error) {
    console.error('Update Item Status failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}