import * as API from "../../api"
import { GETPRODUCTSFORCUSTOMERS } from "../../constants/actionTypes"

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