import mongoose from "mongoose";

const productSchema=new mongoose.Schema(
    {
        farmer:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        name:{type:String,required:true},
        description:{type:String},
        price:{type:Number,required:true},
        stock:{type:Number,required:true,default:0}
    },
    {
        timestamps:true
    }
)

export default mongoose.model("Product",productSchema)