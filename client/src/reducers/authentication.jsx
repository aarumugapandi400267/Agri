import { AUTHENTICATION } from "../constants/actionTypes";

const initialState = { AuthData: null };

const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATION:
            return {
                ...state,
                AuthData: action.payload, // No need for optional chaining
            };

        default:
            return state;
    }
};

export default authenticationReducer;
