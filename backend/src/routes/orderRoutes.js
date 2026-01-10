import express from'express';
import {placeOrder,getAllOrders} from '../controllers/orderController.js';
import verifyToken from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/roleMiddleware.js';

const router = express.Router();
router.post('/', verifyToken, placeOrder);
router.get('/', verifyToken, isAdmin, getAllOrders);

export default router;
