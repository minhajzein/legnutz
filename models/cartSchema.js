const mongoose = require("mongoose")
const Schema = mongoose.Schema

ObjectId = Schema.ObjectId

const cartSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
  },
  products: {
    type: Array,
  },
  totalPrice: {
    type: Number,
  },
})

module.exports = mongoose.model("Cart", cartSchema)
