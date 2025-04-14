import * as api from "../api";
import { GETPRODUCTS, UPDATEPRODUCT,CREATEPRODUCT } from "../constants/actionTypes";

export const getProductsById = () => async (dispatch) => {
    try {
        const { data } = await api.getProducts()

        dispatch({
            type: GETPRODUCTS,
            payload: data
        })

        return data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}

export const updateProductById = (id, updatedProduct) => async (dispatch) => {
    try {
        const {data}= await api.updateProductById(id, updatedProduct); 
        dispatch({
            type: UPDATEPRODUCT,
            payload: data, 
        });

        return data;
    } catch (error) {
        console.error("Product Update Error:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export const createProduct=(product)=>async(dispatch)=>{
    try {
        const {data}=await api.createProduct(product)

        dispatch({
            type:CREATEPRODUCT,
            payload:data
        })

        return data
    } catch (error) {
        console.error("Product Create Error:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
}