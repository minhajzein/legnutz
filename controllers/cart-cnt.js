const { default: mongoose, mongo } = require("mongoose")
const Cart = require("../models/cartSchema")
const Product = require("../models/productSchema")
const Address = require('../models/addressSchema')
const Order = require('../models/orderSchema')
const Razorpay = require('razorpay')
const Coupon = require('../models/couponSchema')
const { json } = require("express")

const instance = new Razorpay({
  key_id: 'rzp_test_jk6BVykF0sfMd7',
  key_secret: 'No8F91siQUTe3v8aIuB6MLc8'
})

let lastAdded = 0

module.exports = {
  goToCart: async (req, res) => {
    let cartCount
    try {
      const orders = await Order.find({ user: mongoose.Types.ObjectId(req.session.user._id) })
      let cartItems;
      const cart = await Cart.findOne({ user: req.session.user._id })
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
      res.render("user/cart", { user: req.session.user, cartCount, cart, cartItems, totalAmount, orders })
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
      const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
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
            { user: mongoose.Types.ObjectId(req.session.user._id) },
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
    } catch (err) {
      console.log(err);
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

    } catch (err) {
      console.log(err);
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
      const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
      const orders = await Order.find({ user: mongoose.Types.ObjectId(req.session.user._id) })
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
      if (cartItems) {
        res.render('user/checkout', { user: req.session.user, cartCount, cart, totalAmount, cartItems, addresses, orders })
      } else {
        res.redirect('/not-found')
      }
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  placeOrder: async (req, res) => {
    try {
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
        await Address.create({
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
        })
      } else {
        address = await Address.findById(req.body.ORIGIN)
      }
      let orderStatus = req.body.paymentMethod === 'COD' ? 'placed' : 'payment pending'
      const date = new Date()
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
            orderedDate: date.toLocaleDateString(),
            trackOrder: {
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString(),
              status: orderStatus
            }
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
            orderedDate: date.toLocaleDateString(),
            trackOrder: {
              date: date.toLocaleDateString(),
              time: date.toLocaleTimeString(),
              status: orderStatus
            }
          })
        })
        await Cart.deleteOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
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
      const date = new Date()
      const trackObj = {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        status: 'placed'
      }
      const crypto = require('crypto')
      let hmac = crypto.createHmac('sha256', 'No8F91siQUTe3v8aIuB6MLc8')
      hmac.update(req.body.payment.razorpay_order_id + '|' + req.body.payment.razorpay_payment_id)
      hmac = hmac.digest('hex')
      if (hmac == req.body.payment.razorpay_signature) {
        const justOrders = await Order.find().sort({ createdAt: -1 }).limit(lastAdded)
        justOrders.forEach(async (obj) => {
          await Order.updateOne({ _id: mongoose.Types.ObjectId(obj._id) },
            {
              $set: {
                orderStatus: 'placed'
              }
            })
          await Order.updateOne({ _id: mongoose.Types.ObjectId(obj._id) },
            {
              $push: {
                trackOrder: trackObj
              }
            })
        })
        res.json({ status: true })
      }
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  applyCoupon: async (req, res) => {
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
    try {
      if (req.body.couponCode != '') {
        const coupon = await Coupon.findOne({ couponCode: req.body.couponCode })
        if (coupon) {
          if (coupon.couponStatus == 'active') {
            if (coupon.couponType == 'percent') {
              const saved = (totalAmount / 100) * parseInt(coupon.amountOrPercent)
              totalAmount = totalAmount - saved
              if (coupon.quantity > 0) {
                await Coupon.updateOne({ _id: coupon._id }, {
                  $set: {
                    couponStatus: 'used',
                    quantity: parseInt(coupon.quantity) - 1
                  }
                })
                res.json({ coupon: true, totalAmount, saved })
              } else {
                res.json({ notExist: true })
              }
            } else {
              totalAmount = totalAmount - parseInt(coupon.amountOrPercent)
              if (coupon.quantity > 0) {
                await Coupon.updateOne({ _id: coupon._id }, {
                  $set: {
                    couponStatus: 'used',
                    quantity: parseInt(coupon.quantity) - 1
                  }
                })
                res.json({ coupon: true, totalAmount, saved: parseInt(coupon.amountOrPercent) })
              } else {
                res.json({ notExist: true })
              }
            }
          } else if (coupon.couponStatus == 'used') {
            res.json({ used: true })
          } else if (coupon.couponStatus == 'expired') {
            res.json({ expired: true })
          }
        } else {
          res.json({ notExist: true })
        }
      } else {
        res.json({ notExist: true })
      }
    } catch (err) {
      console.log(err);
      res.redirect('/admin/not-available')
    }
  },
  successPage: async (req, res) => {
    try {
      const orders = await Order.find({ user: mongoose.Types.ObjectId(req.session.user._id) })
      const currentOrders = await Order.find({ user: mongoose.Types.ObjectId(req.session.user._id) }).sort({ createdAt: -1 }).limit(lastAdded)
      let sum = 0;
      let total = currentOrders.map((obj) => {
        sum = sum + obj.totalAmount
        return sum
      })
      total = total[total.length - 1]
      const address = currentOrders[0].shippingAddress
      let paymentMethod;
      if (currentOrders[0].paymentMethod == 'COD') {
        paymentMethod = 'Cash on delivery'
      } else {
        paymentMethod = 'Prepaid'
      }
      const date = new Date()
      let expectedDate = date.setDate(date.getDate() + 10)
      res.render('user/order-success', { user: req.session.user, cartCount: 0, currentOrders, orders, date, total, address, paymentMethod, expectedDate, totalAmount: 0 })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const date = new Date()
      const trackObj = {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        status: 'canceled'
      }
      await Order.updateOne({ _id: req.query.id },
        {
          $set: {
            orderStatus: 'canceled'
          }
        })
      await Order.updateOne({ _id: mongoose.Types.ObjectId(req.query.id) },
        {
          $push: {
            trackOrder: trackObj
          }
        })
      res.redirect('/orderList')
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  }
}