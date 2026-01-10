import Order from "../models/Order.js";

export const placeOrder = async (req, res, next) => {
    try {
        const { products, totalAmount } = req.body;
        const order = await Order.create({
            user: req.user.userId,
            products,
            totalAmount
        });
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price');

        res.json(orders);
    } catch (error) {
        next(error);
    }
};
