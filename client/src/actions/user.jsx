import * as API from "../api";
import { GETUSER, UPDATEUSER } from "../constants/actionTypes";

export const updateUser = (formData) => async (dispatch) => {
  try {
    const { data } = await API.updateUser(formData);

    dispatch({
      type: UPDATEUSER,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error(
      "Profile Update failed:",
      error.response?.data || error.message
    );
    return { error: error.response?.data || error.message };
  }
};

export const getUser = () => async (dispatch) => {
  try {
    const { data } = await API.getUser();

    dispatch({
      type: GETUSER,
      payload: data,
    });

    return data;
  } catch (error) {
    console.error(
      "Get User failed:",
      error.response?.data || error.message
    );
    return { error: error.response?.data || error.message };
  }
};

export const fetchOrders = (role) => async (dispatch) => {
  try {
    const { data } = await API.fetchOrders(role);

    dispatch({
      type: `FETCH_${role.toUpperCase()}_ORDERS`,
      payload: data.orders,
    });

    return data.orders;
  } catch (error) {
    console.error(`Fetch ${role} orders failed:`, error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
};

