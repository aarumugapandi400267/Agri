import * as API from "../../api/cartAPI"
import { GETPRODUCTSFORCUSTOMERS,DELETECARTITEM, ADDUSERADDRESS } from "../../constants/actionTypes"

export const fetchProducts=()=>async (dispatch) => {
    try {
        const {data}=await API.getProductsForCustomer()

        dispatch({
            type:GETPRODUCTSFORCUSTOMERS,
            payload:data
        })
        return data
    } catch (error) {
        console.error("Product fetch failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

export const deleteCartItem=(id)=>async (dispatch) => {
    try {
        const {data} =await API.deleteCartItem(id)

        dispatch({
            type:DELETECARTITEM,
            payload:data
        })

        return data
    } catch (error) {
        console.error("Product delete failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

// actions/user.js
export const addUserAddress = (address) => async (dispatch) => {
    try {
        const { data } = await API.addUserAddress(address);
        dispatch({ type: ADDUSERADDRESS, payload: data });
        return data;
    } catch (error) {
        console.error("Add address failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};