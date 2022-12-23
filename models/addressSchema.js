const mongoose = require('mongoose')
let ObjectId = mongoose.Schema.ObjectId
const addressSchema = new mongoose.Schema({
        user: {
                type: ObjectId,
                require: true
        },
        firstName: {
                type: String,
                require: true
        },
        lastName: {
                type: String,
                require: true
        },
        mobileNumber: {
                type: Number,
                require: true
        },
        Email: {
                type: String,
                require: true
        },
        country: {
                type: String,
                require: true
        },
        address: {
                type: String,
                require: true
        },
        townOrCity: {
                type: String,
                require: true
        },
        stateOrDistrict: {
                type: String,
                require: true
        },
        postalCode: {
                type: Number,
                require: true
        }
}, { timestamps: true })

const address = mongoose.model('adress', addressSchema)
module.exports = address;