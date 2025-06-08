import Order from '../Models/modelOrder.js';
import Coupon from '../Models/modelsCoupon.js';

// Tar emot userId, hämtar order och räknar ut totalsumma och rabatt
export async function getCartTotalWithDiscount(userId, discountCode = null) {
    try {
        const order = await Order.findOne({ userId }).sort({ createdAt: -1 });

        if (!order || !order.items || order.items.length === 0) {
            return {
                totalBeforeDiscount: 0,
                price3for2: 0,
                totalQuantity: 0,
                message: 'Varukorgen är tom eller hittades inte'
            };
        }

        let totalBeforeDiscount = 0;
        let price3for2 = 0;
        let totalQuantity = 0;

        for (const item of order.items) {
            const quantity = Number(item.quantity);
            const price = Number(item.price);

            totalBeforeDiscount += quantity * price;
            totalQuantity += quantity;

            // Köp 3 betala för 2
            const setOfThree = Math.floor(quantity / 3);
            const remaining = quantity % 3;
            price3for2 += (setOfThree * 2 * price) + (remaining * price);
        }

        let discountApplied = false;
        let discount = 0;
        let couponInfo = null;

        // om discountCode är angivet, hämta och validera kupongen
        if (discountCode) {
            const coupon = await Coupon.findOne({ code: discountCode, active: true });

            if (!coupon) throw new Error('Invalid or inactive coupon code');

            const now = new Date();
            if (now < coupon.validFrom || now > coupon.validTo) {
                throw new Error('Coupon is expired or not yet active');
            }

            // Check usage
            if (coupon.used >= (coupon.maxUses || 1)) {
                throw new Error('Coupon has already been used');
            }

            // Rabatt på priset efter "3 för 2"
            if (coupon.discountType === 'percent') {
                discount = (price3for2 * coupon.discountValue) / 100;
            } else if (coupon.discountType === 'amount') {
                discount = coupon.discountValue;
            }

            // Markera kupongen som använd
            coupon.used += 1;
            if (coupon.used >= coupon.maxUses) {
                coupon.active = false;
            }
            await coupon.save();

            couponInfo = {
                code: coupon.code,
                type: coupon.discountType,
                value: coupon.discountValue,
            };
            discountApplied = true;
        }

        const totalToPay = Math.round(price3for2 - discount);

        // returna resultatet
        return {
            totalBeforeDiscount: Math.round(totalBeforeDiscount),
            price3for2: Math.round(price3for2),
            totalQuantity,
            discount: Math.round(discount),
            totalToPay,
            discountApplied,
            coupon: couponInfo,
            items: order.items
        };
    } catch (error) {
        return {
            error: true,
            message: 'Kunde inte beräkna rabatt',
            details: error.message
        };
    }
};


