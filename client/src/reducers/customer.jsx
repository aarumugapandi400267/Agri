import { SAVECART, GETCART, GETPRODUCTSFORCUSTOMERS, DELETECARTITEM,FETCHCUSTOMERORDER,GETORDERBYID, ADDITEMTOCART, CLEARCART } from "../constants/actionTypes";

const initialState = {};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCHCUSTOMERORDER:
        case GETORDERBYID:
            return { ...state, orders: action.payload };
        case GETPRODUCTSFORCUSTOMERS:
            return { ...state, fetchedProducts: action.payload };
        case ADDITEMTOCART:
        case CLEARCART:
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