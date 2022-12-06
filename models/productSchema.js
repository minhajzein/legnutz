const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productDescription: {
      type: String,
      required: true,
      trim: true,
    },
    productCategory: {
      type: String,
      required: true,
      trim: true,
    },
    productPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    oldPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    productImg: {
      type: Array,
      required: true
    },
    productBrand: {
      type: String,
      required: true,
      trim: true,
    },
    productStock: {
      type: Number,
      required: true,
      trim: true,
    },
    productDiscount: {
      type: Number,
      required: true,
      trim: true,
    },
    productSize: {
      type: Array,
      required: true,
      trim: true,
    },
    productColor: {
      type: Array,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;
