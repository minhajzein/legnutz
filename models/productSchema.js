const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
      trim: true,
    },
    ProductDes: {
      type: String,
      required: true,
      trim: true,
    },
    ProductCategory: {
      type: String,
      required: true,
      trim: true,
    },
    ProductSubCategory: {
      type: String,
      required: true,
      trim: true,
    },
    ProductPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    POldPrice: {
      type: Number,
      required: true,
      trim: true,
    },
    PImage: {
      type: Array,
      required: true,
      trim: true,
    },
    PBrand: {
      type: String,
      required: true,
      trim: true,
    },
    PStock: {
      type: Number,
      required: true,
      trim: true,
    },
    PDiscount: {
      type: Number,
      required: true,
      trim: true,
    },
    PSize: {
      type: Array,
      required: true,
      trim: true,
    },
    PColor: {
      type: Array,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema);
module.exports = product;
