import { AUTHENTICATION } from "../constants/actionTypes";

const initialState = { AuthData: null };

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATION:
            return {
                ...state,
                AuthData: action.payload, 
            };

        default:
            return state;
    }
};

export default authenticationReducer;
