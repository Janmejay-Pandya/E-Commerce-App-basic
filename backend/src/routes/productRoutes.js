import express from 'express';
import { getProducts, getProductById, addProduct } from '../controllers/productController.js';
import verifyToken from'../middleware/authMiddleware.js';
import isAdmin from '../middleware/roleMiddleware.js';

const router = express.Router();
router.get('/', verifyToken,getProducts);
router.get('/:id',verifyToken, getProductById);
router.post('/', verifyToken, isAdmin, addProduct);

export default router;
