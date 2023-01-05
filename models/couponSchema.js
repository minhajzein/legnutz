const mongoose = require('mongoose');
const schema = mongoose.Schema;

const couponSchema = new schema({
    couponTitle: {
        type: String,
        require: true
    },
    couponCode: {
        type: String,
        require: true,
        unique: true
    },
    startDate: {
        type: String,
        require: true
    },
    endDate: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    couponType: {
        type: String,
        require: true
    },
    couponStatus: {
        type: String,
        require: true
    },
    amountOrPercent: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('Coupon', couponSchema)