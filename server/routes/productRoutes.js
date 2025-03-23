import express from "express";
import {createProduct,getProducts,updateProduct,deleteProduct} from "../controllers/productController.js"
import { protect,restrictTo } from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router=express.Router()

router.post("/",protect,restrictTo("Farmer"),upload.single("image"),createProduct)
router.get("/",getProducts)
router.get("/:id",getProducts)
router.put("/:id",protect,restrictTo("Farmer"),updateProduct)
router.delete("/:id",protect,restrictTo("Farmer"),deleteProduct)

export default router