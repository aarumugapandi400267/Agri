// backend/routes/cart.js
import express from 'express';
import Cart from '../../models/Cart.js';
import Product from '../../models/Product.js';
import { protect } from '../../middlewares/authMiddleware.js';
import { addItemToCart,clearCart,getCart,removeItemFromCart,saveCart, updateCartItemQuantity} from '../../controllers/customer/cartController.js';

const router = express.Router();

// Add or update item in cart
router.post('/add',protect, addItemToCart);

// Get current cart
router.get('/', protect, getCart);

// Remove item from cart
router.delete('/remove',protect, removeItemFromCart);

// Clear cart
router.put('/clear', clearCart);

// Save the cart
router.post('/save', protect, saveCart); 

router.put('/update',protect,updateCartItemQuantity)

export default router;
