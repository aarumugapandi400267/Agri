import { CREATEPRODUCT, GETPRODUCTS, GETUSER, UPDATEPRODUCT, UPDATEUSER } from "../constants/actionTypes";

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
        default:
            return state;
    }
}

export default farmerReducer 