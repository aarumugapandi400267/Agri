// backend/routes/cart.js
import express from 'express';
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { addItemToCart,clearCart,getCart,removeItemFromCart,saveCart} from '../../controllers/customer/cartController.js';

const router = express.Router();

// Add or update item in cart
router.post('/add',protect, addItemToCart);

// Get current cart
router.get('/', protect, getCart);

// Remove item from cart
router.delete('/remove',protect, removeItemFromCart);

// Clear cart
router.put('/clear', clearCart);

router.post('/save', protect, saveCart); // Add a route to save the cart

export default router;
