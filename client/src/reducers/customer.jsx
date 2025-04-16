import { GETPRODUCTSFORCUSTOMERS } from "../constants/actionTypes";

const initialState={}

const customerReducer=(state=initialState,action)=>{
    switch (action.type) {
        case GETPRODUCTSFORCUSTOMERS:
            return {
                ...state,
                fetchedProducts:action.payload
            }
    
        default:
            return state;
    }
}