import Order from '../Models/modelOrder.js';
import Cart from '../Models/modelCart.js';
import generateOrderId from '../Utils/generateOrderID.js';


// GET /api/orders, hämtar alla ordrar
export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 });
		res.status(200).json({ orders });
	} catch (err) {
		res.status(500).json({ message: 'Serverfel', error: err.message });
	}
};

// GET /api/orders/:userId, hämtar ordrar för en specifik användare
export const getOrdersByUserId = async (req, res) => {
	try {
		const { userId } = req.params;

		const orders = await Order.find({ userId }).sort({ createdAt: -1 });

		if (!orders.length) {
			return res
				.status(404)
				.json({ message: 'Inga ordrar hittades för denna användare' });
		}

		res.status(200).json({ orders });
	} catch (err) {
		res.status(500).json({ message: 'Serverfel', error: err.message });
	}
};

//POST /api/orders
export const createNewOrder = async (req, res) => {
    try {
        const { cartId } = req.body;
        const cart = await Cart.findOne({ cartId });
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart not found or empty' });
        }

        const orderId = generateOrderId();

        // Lägg till orderId och cartId på varje item
        const itemsWithIds = cart.items.map(item => ({
            ...item.toObject ? item.toObject() : item,
            orderId,
            cartId: cart.cartId
        }));

        const order = await Order.create({
            userId: cart.userId || cart.guestId,
            cartId: cart.cartId,
            items: itemsWithIds,
            totalPrice: cart.totalPrice,
            orderId
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: 'Serverfel', error: error.message });
    }
};

