import * as api from '../api/order';
import { GETORDERBYID } from '../constants/actionTypes';

export const getOrderById = (id) => async () => {
  try {
    const { data } = await api.getOrderById(id);
    return data;
  } catch (error) {
    console.error('Get Order by ID failed:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
}