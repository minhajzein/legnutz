const { default: mongoose } = require("mongoose")
const Cart = require("../models/cartSchema")
const Product = require("../models/productSchema")
const User = require("../models/userSchema")

module.exports = {
  goToCart: async (req, res) => {
    let cartCount
    try {
      const user = await User.findById(req.session.user._id)
      const cart = await Cart.findOne({ user: req.session.user._id })
      if (cart) {
        cartCount = cart.products.length
        let cartItems = await Cart.aggregate([
          {
            $match: { user: req.session.user._id },
          },
          {
            $project: {},
          },
        ])
      } else {
        cartCount = 0
      }
      res.render("user/cart", { user, cartCount, cart })
    } catch {
      res.redirect("/not-found")
    }
  },
  addToCart: async (req, res) => {
    try {
      let proObj = {
        item: mongoose.Types.ObjectId(req.query.id),
        quantity: 1,
      }
      if (req.session.loggedIn) {
        const cart = await Cart.findOne({ user: req.session.user._id })
        if (cart) {
          let itemExist = cart.products.findIndex(
            product => product.item == req.query.id
          )
          if (itemExist != -1) {
            await Cart.updateOne(
              {
                user: mongoose.Types.ObjectId(req.session.user._id),
                "products.item": mongoose.Types.ObjectId(req.query.id),
              },
              {
                $inc: {
                  "products.$.quantity": 1,
                },
              }
            )
            console.log(
              "======================================================="
            )
            req.json({ status: false })
          } else {
            await Cart.updateOne(
              { user: req.session.user._id },
              {
                $push: {
                  products: proObj,
                },
              }
            )
            res.json({ status: true })
          }
        } else {
          await Cart.create({
            user: mongoose.Types.ObjectId(req.session.user._id),
            products: proObj,
          })
          res.json({ status: true })
        }
      }
    } catch {
      res.redirect("/not-found")
    }
  },
}
