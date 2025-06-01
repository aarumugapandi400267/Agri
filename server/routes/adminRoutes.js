import express from "express";
import * as adminController from "../controllers/adminController.js";
const router = express.Router();

// Public admin routes
router.post('/login', adminController.adminLogin);
router.post('/register', adminController.adminRegister); // <-- This line is required

// Protected admin routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.put('/orders/:id', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

export default router;