import Cart from '../../models/Cart.js';

// Add an item to the cart
export const addItemToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, variant } = req.body;

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
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get the cart for a user
export const getCart = async (req, res) => {
    try {
        console.log(req.user)
        const userId  = req.user._id;

        const cart = await Cart.findById({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const clearCart =async (req, res) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [], updatedAt: new Date() },
        { new: true }
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Failed to clear cart.' });
    }
  }