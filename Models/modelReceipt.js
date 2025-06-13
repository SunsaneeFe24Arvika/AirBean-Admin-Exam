import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
    userId: String,
    items: Array,
    totalBeforeDiscount: Number,
    price3for2: Number,
    discount: Number,
    totalToPay: Number,
    coupon: Object,
    createdAt: { type: Date, default: Date.now }
});

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;