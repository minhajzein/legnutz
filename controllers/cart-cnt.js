const { default: mongoose, mongo } = require("mongoose")
const Cart = require("../models/cartSchema")
const Product = require("../models/productSchema")
const User = require("../models/userSchema")
const Address = require('../models/addressSchema')
const Order = require('../models/orderSchema')
const Razorpay = require('razorpay')

const instance = new Razorpay({
  key_id: 'rzp_test_jk6BVykF0sfMd7',
  key_secret: 'No8F91siQUTe3v8aIuB6MLc8'
})

let lastAdded = 0

module.exports = {
  goToCart: async (req, res) => {
    let cartCount
    try {
      const user = await User.findById(req.session.user._id)
      const cart = await Cart.findOne({ user: req.session.user._id })
      let cartItems;
      if (cart) {
        cartCount = cart.products.length
        cartItems = await Cart.aggregate([
          {
            $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
          },
          {
            $unwind: '$products',
          },
          {
            $project: {
              item: '$products.item',
              quantity: '$products.quantity'
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'item',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] }
            }
          }
        ])
      } else {
        cartCount = 0
      }
      let totalAmount = await Cart.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] }
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: ['$quantity', '$product.productPrice']
              }
            }
          }
        }
      ])
      if (totalAmount[0]) {
        totalAmount = totalAmount[0].total;
      } else {
        totalAmount = 0
      }
      res.render("user/cart", { user, cartCount, cart, cartItems, totalAmount })
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
  quantityScale: async (req, res) => {
    try {
      if (req.body.quantity == 1 && req.body.count == 1 || req.body.quantity != 1) {
        await Cart.updateOne(
          {
            _id: mongoose.Types.ObjectId(req.body.cart),
            'products.item': mongoose.Types.ObjectId(req.body.prodId)
          },
          {
            $inc: {
              'products.$.quantity': parseInt(req.body.count)
            }
          }
        )
        let totalAmount = await Cart.aggregate([
          {
            $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
          },
          {
            $unwind: '$products',
          },
          {
            $project: {
              item: '$products.item',
              quantity: '$products.quantity'
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'item',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] }
            }
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: ['$quantity', '$product.productPrice']
                }
              }
            }
          }
        ])
        if (totalAmount[0]) {
          totalAmount = totalAmount[0].total;
        } else {
          totalAmount = 0
        }
        res.json({ status: true, totalAmount })
      } else {
        res.json({ status: false })
      }

    } catch {
      res.redirect('/not-found')
    }
  },
  removeItem: async (req, res) => {
    try {
      await Cart.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.body.cartId)
        },
        {
          $pull: {
            products: {
              item: mongoose.Types.ObjectId(req.body.prodId)
            }
          }
        }
      )
      res.json({ removeItem: true })
    } catch {
      res.redirect('/not-found')
    }
  },
  checkOut: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id)
      const cart = await Cart.findOne({ user: req.session.user._id })
      let cartCount;
      let cartItems;
      if (cart) {
        cartCount = cart.products.length
        cartItems = await Cart.aggregate([
          {
            $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
          },
          {
            $unwind: '$products',
          },
          {
            $project: {
              item: '$products.item',
              quantity: '$products.quantity'
            }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'item',
              foreignField: '_id',
              as: 'product'
            }
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] }
            }
          }
        ])
      } else {
        cartCount = 0
      }
      let totalAmount = await Cart.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] }
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: ['$quantity', '$product.productPrice']
              }
            }
          }
        }
      ])
      if (totalAmount[0]) {
        totalAmount = totalAmount[0].total;
      } else {
        totalAmount = 0
      }
      const addresses = await Address.find({ user: mongoose.Types.ObjectId(req.session.user._id) })
      res.render('user/checkout', { user, cartCount, cart, totalAmount, cartItems, addresses })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  placeOrder: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id)
      let cartItems = await Cart.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] }
          }
        }
      ])
      let totalAmount = await Cart.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item',
            quantity: '$products.quantity'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'item',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $project: {
            item: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] }
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $multiply: ['$quantity', '$product.productPrice']
              }
            }
          }
        }
      ])
      if (totalAmount[0]) {
        totalAmount = totalAmount[0].total;
      } else {
        totalAmount = 0
      }
      lastAdded = cartItems.length
      let address;
      if (req.body.ORIGIN == 'createOne') {
        address = {
          user: mongoose.Types.ObjectId(req.session.user._id),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobileNumber: req.body.mobileNumber,
          Email: req.body.Email,
          country: req.body.country,
          address: req.body.address,
          townOrCity: req.body.townOrCity,
          stateOrDistrict: req.body.stateOrDistrict,
          postalCode: req.body.postalCode
        }
        await Address.create(address)
      } else {
        address = await Address.findById(req.body.ORIGIN)
      }
      let orderStatus = req.body.paymentMethod === 'COD' ? 'placed' : 'payment pending'
      if (req.body.paymentMethod == 'COD') {
        cartItems.forEach(async (obj) => {
          await Order.create({
            user: mongoose.Types.ObjectId(req.session.user._id),
            productDetails: obj.product,
            quantity: obj.quantity,
            shippingAddress: address,
            orderStatus: orderStatus,
            paymentMethod: req.body.paymentMethod,
            shippingMode: req.body.shippingMode,
            totalAmount: obj.quantity * obj.product.productPrice,
            orderedDate: new Date()
          })
        })
        await Cart.deleteOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
        res.json({ codsuccess: true })
      } else {
        cartItems.forEach(async (obj) => {
          await Order.create({
            user: mongoose.Types.ObjectId(req.session.user._id),
            productDetails: obj.product,
            quantity: obj.quantity,
            shippingAddress: address,
            orderStatus: orderStatus,
            paymentMethod: req.body.paymentMethod,
            shippingMode: req.body.shippingMode,
            totalAmount: obj.quantity * obj.product.productPrice,
            orderedDate: new Date()
          })
        })
        await Cart.deleteOne({ user: req.session.user._id })
        const justOrders = await Order.find().sort({ createdAt: -1 }).limit(lastAdded)
        const orderId = justOrders[0]._id
        const options = {
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: '' + orderId,
        }
        await instance.orders.create(options, (err, order) => {
          if (err) {
            console.log(err);
          } else {
            res.json({ order: order })
          }
        })
      }
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  verifyPayment: async (req, res) => {
    try {
      console.log(req.body);
      const crypto = require('crypto')
      let hmac = crypto.createHmac('sha256', 'No8F91siQUTe3v8aIuB6MLc8')
      hmac.update(req.body.payment.razorpay_order_id + '|' + req.body.payment.razorpay_payment_id)
      hmac = hmac.digest('hex')
      if (hmac == req.body.payment.razorpay_signature) {
        const orders = await Order.find().sort({ createdAt: -1 }).limit(lastAdded)
        orders.forEach(async (obj) => {
          await Order.updateOne({ _id: mongoose.Types.ObjectId(obj._id) },
            {
              $set: {
                orderStatus: 'placed'
              }
            })
        })
        res.json({ status: true })
      }
    } catch (err) {
      console.log(err);
    }
  },
  successPage: async (req, res) => {
    try {
      const user = await User.findById(req.session.user._id)
      const orders = await Order.find().sort({ createdAt: -1 }).limit(lastAdded)
      let sum = 0;
      let total = orders.map((obj) => {
        sum = sum + obj.totalAmount
        return sum
      })
      total = total[total.length - 1]
      const address = orders[0].shippingAddress
      let paymentMethod;
      if (orders[0].paymentMethod == 'COD') {
        paymentMethod = 'Cash on delivery'
      } else {
        paymentMethod = 'Prepaid'
      }
      const date = new Date()
      let expectedDate = date.setDate(date.getDate() + 10)
      res.render('user/order-success', { user, cartCount: 0, orders, date, total, address, paymentMethod, expectedDate })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  }
}
