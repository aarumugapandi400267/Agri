import { SAVECART, GETCART, GETPRODUCTSFORCUSTOMERS, DELETECARTITEM } from "../constants/actionTypes";

const initialState = {};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETPRODUCTSFORCUSTOMERS:
            return { ...state, fetchedProducts: action.payload };
        case GETCART:
            return { ...state, items: action.payload };
        case SAVECART:
            return { ...state, items: action.payload };
        case DELETECARTITEM:
            return {...state,items: action.payload};
        default:
            return state;
    }
};

export default customerReducer;