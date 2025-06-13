import express from 'express';
import {getAllOrders,getOrdersByUserId, createNewOrder } from '../Service/ordersController.js';
import Receipt from '../Models/modelReceipt.js';
import { getCartTotalWithDiscount } from '../Service/discountController.js';


const orderRouter = express.Router();

orderRouter.get('/', getAllOrders); // /api/orders
orderRouter.get('/:userId', getOrdersByUserId); // /api/orders/:userId
orderRouter.post('/', createNewOrder); // /api/orders och skickar in body med cartId

// Kvitto
orderRouter.post('/:userId/checkout', async (req, res) => {
    const userId = req.params.userId;
    const discountCode = req.body.discountCode;
    try {
        const result = await getCartTotalWithDiscount(userId, discountCode);

        // Spara kvitto i DB (skapa en Receipt-modell)
        const receipt = await Receipt.create({
            userId,
            items: result.items,
            totalBeforeDiscount: result.totalBeforeDiscount,
            price3for2: result.price3for2,
            discount: result.discount,
            totalToPay: result.totalToPay,
            coupon: result.coupon,
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Order sparad och kvitto skapat!',
            receipt
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Kunde inte spara order', error: err.message });
    }
});

export default orderRouter;
