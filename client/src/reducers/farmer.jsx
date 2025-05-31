import { CREATEPRODUCT, FETCHFARMERORDER, GETPRODUCTS, GETUSER, UPDATEPRODUCT, UPDATEUSER } from "../constants/actionTypes";

const initialState = {}

const farmerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETPRODUCTS:
        case UPDATEPRODUCT:
        case CREATEPRODUCT:
            return {
                ...state,
                farmerProducts: action.payload
            }
        case GETUSER:
        case UPDATEUSER:
            return {
                ...state,
                profile:action.payload
            }
        case FETCHFARMERORDER:
            return {
                ...state,
                orders: action.payload
            }
        default:
            return state;
    }
}

export default farmerReducer 