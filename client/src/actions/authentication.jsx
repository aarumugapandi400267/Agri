import * as api from "../api";
import { AUTHENTICATION } from "../constants/actionTypes";

export const login = (formData,navigate) => async (dispatch) => {
    try {
        const { data } = await api.login(formData);
        localStorage.setItem("profile", JSON.stringify(data)); // Store user data
        
        dispatch({
            type: AUTHENTICATION,
            payload: data,
        });
        navigate('/dashboard')
        return data; // Return data for further handling in the component
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};
