import express from 'express';
import { getCartById, getAllCarts, updateCart } from '../Service/cartController.js';
import { getProduct } from '../Middlewares/menuAuth.js';
import { getCartTotalWithDiscount } from '../Service/discountController.js';

const router = express.Router();

// GET all carts
router.get('/', async (req, res) => {
    try {
        const carts = await getAllCarts();
        res.json({ success: true, carts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get carts', error: err.message });
    }
});

// GET cart by ID
router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await getCartById(req.params.cartId);
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        res.json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to get cart', error: err.message });
    }
});

// PUT update cart - supports logged-in and guest users
router.put('/', async (req, res) => {
    const { prodId, qty, guestId, userId } = req.body;
    const product = await getProduct(prodId);

    if (!prodId || qty === undefined) {
        return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    try {
        const result = await updateCart({ userId, guestId, prodId, qty });
        res.json({ success: true, cart: result.cart, guestId: result.guestId });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to update cart', error: err.message });
    }
});

//GET Discount
router.get('/:userId/discount', async (req, res) => {
    const userId = req.params.userId;
    const discountCode = req.query.discountCode; // Hämta rabattkod från query
    try {
        const result = await getCartTotalWithDiscount(userId, discountCode);

         
        let message = 'Du missar vårt erbjudande! Köp 3 betala för 2'; // Om kunder har köpt färre än 3 st.
        if (result && result.totalQuantity >= 3) {
            message = 'Du är med vårt erbjudande, Köp 3 betala för 2';
        }

        if (result) {
            return res.status(200).json({
                success: true,
                message,
                cart: result,
            });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to get discount' });
        }
     } catch (err) {
        return res.status(500).json({ success: false, message: 'Serverfel', error: err.message });
    }
});

export default router;
