import { AUTHENTICATION } from "../constants/actionTypes";

const authenticationReducer=(state={AuthData:null},action)=>{
    switch (action.type) {
        case AUTHENTICATION:
            localStorage.setItem("profile",JSON.stringify({...action.data}))
            return {
                ...state,
                AuthData:action?.data
            }

        default:
            return state
    }
}