import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    cartId: { type: String, required: function() { return !this.cartId; } },
    prodId: String,
    title: String,
    price: Number,
    quantity: { type: Number, default: 1 }
});

const cartSchema = new mongoose.Schema({
    cartId: { type: String, required: function() { return !this.cartId; } },
    userId: { type: String, required: function () { return !this.guestId; } },
    guestId: { type: String, required: function () { return !this.userId; } },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
