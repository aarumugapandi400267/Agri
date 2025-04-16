import express from "express";
import {createProduct,getProducts,updateProduct,deleteProduct,getProductsById} from "../controllers/productController.js"
import { protect,restrictTo } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router=express.Router()

router.post("/",protect,restrictTo("Farmer"),upload.single("image"),createProduct)
router.get("/fetch",getProducts)
router.get("/",protect,getProductsById)
router.put("/:id",protect,updateProduct)
router.delete("/:id",protect,restrictTo("Farmer"),deleteProduct)

export default router