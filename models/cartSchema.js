const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema ({
    user:{
        type: String,
        required: true
    },
    products : {
        type: Array,
        required : true
    }
},{timestamps:true}) 

module.exports = mongoose.model('Cart',cartSchema)