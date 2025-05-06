import Cart from '../../models/Cart.js';

// Add an item to the cart
export const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity, variant } = req.body;
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ userId, items: [] });
        }

        // Check if the product already exists in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            // Update the quantity if the product exists
            existingItem.quantity += quantity;
        } else {
            // Add a new item to the cart
            cart.items.push({ productId, quantity, variant });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove an item from the cart
export const removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(productId._id)
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId._id);

        cart.updatedAt = Date.now();
        await cart.save();
        console.log("Ok")
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get the cart for a user
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(200).json({ success: true, items: [] }); // Return an empty array if no cart exists
        }

        res.status(200).json({ success: true, items: cart.items }); // Return only the items array
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear the cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOneAndUpdate(
            { userId },
            { items: [], updatedAt: new Date() },
            { new: true }
        );

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart.' });
    }
};

export const saveCart = async (req, res) => {
    try {
        const { items } = req.body; // Expect the entire cart items array
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({ userId, items });
        } else {
            // Replace the existing cart items
            cart.items = items;
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantityChange } = req.body; // `quantityChange` can be positive or negative
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Find the item in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (!existingItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        // Update the quantity
        existingItem.quantity = quantityChange;

        // Remove the item if the quantity becomes zero or less
        if (existingItem.quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};