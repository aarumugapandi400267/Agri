import * as API from "../../api/cartAPI";
import { GETCART, SAVECART, DELETECARTITEM, UPDATECART, ADDITEMTOCART, CLEARCART } from "../../constants/actionTypes";

export const getCart = () => async (dispatch) => {
    try {
        const { data } = await API.getCart();

        dispatch({
            type: GETCART,
            payload: data,
        });

        return data;
    } catch (error) {
        console.error("Error fetching cart:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const deleteCartItem = (id) => async (dispatch) => {
    try {
        const { data } = await API.deleteCartItem(id)

        dispatch({
            type: DELETECARTITEM,
            payload: data
        })

        return data
    } catch (error) {
        console.error("Error deleting item:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

export const updateCartItem = (productId, quantity) => async (dispatch) => {
    try {
        const { data } = await API.updateCartItem(productId, quantity)

        dispatch({
            type: UPDATECART,
            payload: data
        })

        return data
    } catch (error) {
        console.error("Error Updating item:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

export const addCartItem = (productId, quantity) => async (dispatch) => {
    try {
        const { data } = await API.addCartItem(productId, quantity)

        dispatch({
            type: ADDITEMTOCART,
            payload: data
        })

        return data
    } catch (error) {
        console.error("Error Adding item:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

export const clearCart = () => async (dispatch) => {
    try {
        const { data } = await API.clearCart()

        dispatch({
            type: CLEARCART,
            payload: data
        })

        return data
    } catch (error) {
        console.error("Error Clear Cart:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}