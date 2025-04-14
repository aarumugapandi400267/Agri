import axios from "axios"

const API = axios.create({
    baseURL:"http://localhost:5000/api",
    withCredentials:true
})

API.interceptors.request.use((req)=>{
    const token=JSON.parse(localStorage.getItem("profile"))["token"]
    if(token){
        req.headers.Authorization=`Bearer ${token}`
        req.headers["Content-Type"]="application/json"
    }
    return req
})

API.interceptors.response.use((response)=>response,(error)=>{
    if(error.response?.status===401){
        console.warn("Session expired. Logging out...");
        // localStorage.removeItem("profile")
        window.location.href="/auth"
    }
    return Promise.reject(error)
})

export default API;
