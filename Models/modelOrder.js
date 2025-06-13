import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
	cartId: { type: String, required: function() { return !this.cartId; } },
	orderId: { type: String, required: function() { return !this.orderId; } },
	prodId: String,
	title: String,
	price: Number,
	quantity: Number,
});

const orderSchema = new mongoose.Schema({
	cartId: { type: String, required: function() { return !this.cartId; } },
	orderId: { type: String, required: function() { return !this.orderId; } },
	userId: { type: String, required: true },
	items: [orderItemSchema],
	totalPrice: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
