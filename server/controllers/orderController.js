import Order from "../models/Order.js"
import calculateTotal from "../config/calculateTotal.js"

export const createOrder = async (req, res) => {
    try {
        const { products } = req.body
        const calculatedTotal=calculateTotal(products)
        const order = await Order.create({
            user: req.user.id, totalPrice:calculatedTotal,products, status: "Pending"
        })

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
    }
}

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("products");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};