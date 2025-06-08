import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    coupId: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }, // Kupongkod
    discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    discountValue: { type: Number, required: true }, // T.ex. 10 för 10% eller 50 för 50 kr
    validFrom: { type: Date },
    validTo: { type: Date },
    maxUses: { type: Number, default: 1 },
    used: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;