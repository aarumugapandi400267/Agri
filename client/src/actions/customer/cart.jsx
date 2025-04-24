import * as API from "../../api/cartAPI";
import { GETCART, SAVECART, DELETECARTITEM } from "../../constants/actionTypes";

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

export const deleteCartItem=(id)=>async (dispatch) => {
    try {
        const {data} =await API.deleteCartItem(id)

        dispatch({
            type:DELETECARTITEM,
            payload:data
        })

        return data
    } catch (error) {
        console.error("Error deleting item:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}