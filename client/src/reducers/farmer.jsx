import { CREATEPRODUCT, GETPRODUCTS, UPDATEPRODUCT } from "../constants/actionTypes";

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

        default:
            return state;
    }
}

export default farmerReducer 