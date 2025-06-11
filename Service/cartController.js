import Cart from '../Models/modelCart.js';
import Menu from '../Models/modelMenu.js';
import User from '../Models/modelUser.js';
import { getCurrentUser } from '../Utils/globalUser.js';
import generateCartId  from '../Utils/generateCartID.js';

// Get all carts (admin/debug purpose)
export async function getAllCarts() {
    const carts = await Cart.find();
    for (const cart of carts) {
        if (!cart.cartId) {
            // Spara endast om cart har userId eller guestId
            if (cart.userId || cart.guestId) {
                cart.cartId = generateCartId();
                await cart.save();
            }
        }
    }
    return carts;
}

// Get a specific cart by ID
export async function getCartById(cartId) {
    if (!cartId) throw new Error('Cart ID is required');
    const cart = await Cart.findOne({ cartId });
    if (!cart) {
        throw new Error('Cart not found');
    }
    return cart;
}

// Add or update a product in the cart
export async function updateCart({ userId, guestId, prodId, qty }) {
    // Använd userId från argumenten i första hand
    const currentUserId = userId || getCurrentUser();

    if (!prodId || typeof qty !== 'number') {
        throw new Error('Product ID and quantity are required.');
    }

    if (qty < 0) {
        throw new Error('Quantity cannot be negative.');
    }

    const product = await Menu.findOne({ prodId });
    if (!product) {
        throw new Error('Product not found.');
    }

    let cart;

    if (currentUserId) {
        const userExists = await User.exists({ userId: currentUserId });
        if (!userExists) {
            throw new Error('Invalid user ID.');
        }
        cart = await Cart.findOne({ userId: currentUserId }) || new Cart({ userId: currentUserId, items: [], totalPrice: 0 });
    } else if (guestId) {
        cart = await Cart.findOne({ guestId }) || new Cart({ guestId, items: [], totalPrice: 0 });
    } else {
        throw new Error('Either a user or guest ID must be provided.');
    }

    // Lägg till CartID om det inte finns
    if (!cart.cartId) {
        cart.cartId = generateCartId();
    }

    // Find the product in the cart
    const itemIndex = cart.items.findIndex(item => item.prodId === prodId);

    if (itemIndex >= 0) {
        if (qty === 0) {
            // Remove item if quantity is zero
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = qty;
            cart.items[itemIndex].cartId = cart.cartId; // Sätt cartId även vid uppdatering
        }
    } else if (qty > 0) {
        // Add new item if it doesn't exist and quantity is positive
        cart.items.push({
            prodId: product.prodId,
            title: product.title,
            price: product.price,
            quantity: qty,
            cartId: cart.cartId // Lägg till cartId på varje item
        });
    }

    //Säkerställ att ALLA items har cartId (även gamla)
    cart.items = cart.items.map(item => ({
        ...item,
        cartId: cart.cartId
    }));

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    await cart.save();

    return {
        cart,
        guestId: cart.guestId,
    };
};