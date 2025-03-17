import * as api from "../api"
import { AUTHENTICATION } from "../constants/actionTypes"

export const login=(formData,navigate)=>async dispatch=>{
    try {
        const {data} = await api.login(formData)
        dispatch({
            type:AUTHENTICATION,
            data:data
        })
        
    } catch (error) {
        
    }
}