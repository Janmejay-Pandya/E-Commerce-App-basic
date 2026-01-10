import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
    try {
        let query = {};
        if (req.user && req.user.role === 'admin') {
            query = { creator: req.user.userId };
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        next(err);
    }
};


export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const product = await Product.create({
            ...req.body,
            creator: req.user.userId
        });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};


