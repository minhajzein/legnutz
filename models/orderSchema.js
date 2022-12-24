const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.ObjectId

const orderSchema = new mongoose.Schema({
        user: {
                type: ObjectId,
                require: true
        },
        productDetails: {
                type: Object,
                require: true
        },
        quantity: {
                type: Number,
                require: true
        },
        shippingAddress: {
                type: Object,
                require: true
        },
        orderStatus: {
                type: String,
                require: true
        },
        paymentMethod: {
                type: String,
                require: true
        },
        shippingMode: {
                type: String
        },
        totalAmount: {
                type: Number,
                require: true
        },
        orderedDate: {
                type: String,
                require: true
        }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order