const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.ObjectId

const orderSchema = new mongoose.Schema({
        user: {
                type: ObjectId,
                require: true
        },
        orderName: {
                type: String,
                require: true
        },
        shippingAddress: {
                type: Array,
                require: true
        },
        orderStatus: {
                type: String
        }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order