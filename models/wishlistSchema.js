const mongoose = require('mongoose')
const Schema = mongoose.Schema

ObjectId = Schema.ObjectId

const wishlistSchema = new Schema({
    user: {
        type: ObjectId,
        required: true,
    },
    products: {
        type: Array,
    }
})

module.exports = mongoose.model("Wishlist", wishlistSchema)
