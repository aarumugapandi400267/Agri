import {combineReducers} from "redux"
import authenticationReducer from "./authentication"
import farmerReducer from "./farmer"

export default combineReducers({
    authenticationReducer,farmerReducer
})
