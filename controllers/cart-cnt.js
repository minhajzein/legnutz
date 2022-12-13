const Cart = require("../models/cartSchema")
const Product = require("../models/productSchema")
const User = require("../models/userSchema")

module.exports = {
  goToCart: async (req, res) => {
    let cartCount;
    try {
      const user = req.session.user
      const cart = await Cart.findOne({ user: user.Email })
      if (cart == null) {
        cartCount = 0
      }else{
        cartCount = cart.products.length
      }
      res.render("user/cart", { user, cartCount, cart })
    } catch {
      res.redirect("/not-found")
    }
  },
  addToCart: async (req, res) => {
    try {
      const id = req.query.id
      const user = req.session.user
      const product = await Product.findById({ _id: id })
      const cart = await Cart.findOne({ user: user.Email })
      if (cart!=null) {
        await Cart.updateOne(
          { user: user.Email },
          {
            $push: {
              products: product,
            },
          }
        )
        res.json({ status: true })
      } else {
        await Cart.create({
          user: user.Email,
          products: product,
        })
        res.json({ status: true })
      }
    } catch {
      res.redirect("/not-found")
    }
  },
}
