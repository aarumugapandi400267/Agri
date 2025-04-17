import * as api from "../api";
import { AUTHENTICATION } from "../constants/actionTypes";

export const login = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.login(formData);
        localStorage.setItem("profile", JSON.stringify(data)); // Store user data
        dispatch({
            type: AUTHENTICATION,
            payload: data,
        });
        if (data.role == "Farmer") {
            navigate('/dashboard')
        } else {
            navigate("/home")
        }
        return data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


export const register = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.register(formData);
        // localStorage.setItem("profile", JSON.stringify(data)); // Store user data

        dispatch({
            type: AUTHENTICATION,
            payload: data,
        });

        if (data.role == "Farmer") {
            navigate('/auth')
        } else {
            navigate("/")
        }
        return data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};
