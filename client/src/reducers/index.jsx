import {combineReducers} from "redux"
import authenticationReducer from "./authentication"
import farmerReducer from "./farmer"
import customerReducer from "./customer"
import adminReducer from "./admin"

export default combineReducers({
    authenticationReducer,farmerReducer,customerReducer,adminReducer
})
