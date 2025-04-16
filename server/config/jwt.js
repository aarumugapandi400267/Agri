import jwt from "jsonwebtoken"

const generateToken=(userId)=>{
    return jwt.sign({
        id:userId,
        // role:role,
    },process.env.JWT_SECRET,{
        expiresIn:"30d",
    })
}

export default generateToken