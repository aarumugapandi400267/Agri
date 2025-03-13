import Review from "../models/Review.js"

export const addReview=async(req,res)=>{
    try {
        const {productId,rating,comment}=req.body
        const review=await Review.create({
            user:req.user.id,
            product:productId,
            rating,
            comment
        })
        res.status(201).json(review)
    } catch (error) {
        res.status(500).json({
            message:"Server error"
        })
    }
}

export const getReviews=async(req,res)=>{
    try {
        const reviews=await Review.find({
            product:req.params.productId
        })
        res.json(reviews)
    } catch (error) {
        res.status(500).json({
            message:"Server error"
        })
    }
}