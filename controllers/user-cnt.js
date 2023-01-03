const { render } = require("ejs")
const { default: mongoose } = require("mongoose")
const User = require("../models/userSchema")
const Product = require("../models/productSchema")
const Cart = require("../models/cartSchema")
const bcrypt = require("bcrypt")
const checkOtp = require("../utils/otp-auth")
const Address = require('../models/addressSchema')
const Order = require("../models/orderSchema")
const Wishlist = require("../models/wishlistSchema")
let userSignup

module.exports = {
  errorPage: async (req, res) => {
    try {
      res.render('user/404')
    } catch (err) {
      console.log(err);
    }
  },
  home: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 }).limit(6)
      const alloys = await Product.find({ productCategory: 'Alloy Wheels' }).limit(8)
      const tyres = await Product.find({ productCategory: 'Tyres' }).limit(8)
      const helmets = await Product.find({ productCategory: 'Helmets' }).limit(8)
      if (req.session.loggedIn) {
        const cart = await Cart.findOne({ user: req.session.user._id })
        let cartCount
        if (cart) {

          cartCount = cart.products.length
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

        const orders = await Order.find()
        res.render("user/home", { user: req.session.user, products, cartCount, totalAmount, orders, alloys, tyres, helmets })
      } else {
        res.render("user/home", { user: false, products, alloys, tyres, helmets })
      }
    } catch (err) {
      console.log(err)
      res.redirect('/not-found')
    }
  },
  goToShop: async (req, res) => {
    try {
      const products = await Product.find()
      if (req.session.loggedIn) {
        const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
        let cartCount;
        if (cart) {
          cartCount = cart.products.length
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
        const orders = await Order.find()
        res.render("user/shop", { products, user: req.session.user, cartCount, cart, totalAmount, orders })
      } else {
        res.render("user/shop", { user: false, products })
      }
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  orderList: async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 })
      const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
      let cartCount;
      if (cart) {
        cartCount = cart.products.length
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
      res.render('user/order-list', { user: req.session.user, totalAmount, orders, cartCount })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  addToWishlist: async (req, res) => {
    try {
      const proObj = {
        item: mongoose.Types.ObjectId(req.body.prodId)
      }
      const wishlist = await Wishlist.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
      if (wishlist) {
        const existItem = wishlist.products.findIndex(product => product.item == req.body.prodId)
        if (existItem != -1) {
          await Wishlist.updateOne(
            { user: mongoose.Types.ObjectId(req.session.user._id) },
            {
              $pull: {
                products: proObj
              }
            }
          )
          res.json({ itemExist: true })
        } else {
          await Wishlist.updateOne(
            { user: mongoose.Types.ObjectId(req.session.user._id) },
            {
              $push: {
                products: proObj
              }
            }
          )
          res.json({ status: true })
        }
      } else {
        await Wishlist.create({
          user: mongoose.Types.ObjectId(req.session.user._id),
          products: proObj
        })
        res.json({ status: true })
      }
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  wishlist: async (req, res) => {
    try {
      const wishItems = await Wishlist.aggregate([
        {
          $match: { user: mongoose.Types.ObjectId(req.session.user._id) }
        },
        {
          $unwind: '$products',
        },
        {
          $project: {
            item: '$products.item'
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
            product: { $arrayElemAt: ["$product", 0] }
          }
        }
      ])
      const orders = await Order.find()
      let cartCount;
      const cart = await Cart.findOne({ user: req.session.user._id })
      if (cart) {
        cartCount = cart.products.length
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
      res.render('user/wishlist', { user: req.session.user, cartCount, orders, totalAmount, wishItems })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  deleteFromWish: async (req, res) => {
    try {
      await Wishlist.updateOne(
        { user: mongoose.Types.ObjectId(req.session.user._id) },
        {
          $pull: {
            products: {
              item: mongoose.Types.ObjectId(req.query.id)
            }
          }
        }
      )
      res.json({ status: true })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  loginPage: (req, res) => {
    try {
      if (req.session.loggedIn) {
        res.redirect("/")
      } else {
        res.render("user/login", { err_msg: false, user: false })
      }
    } catch {
      res.redirect("/not-found")
    }
  },
  productDetails: async (req, res) => {
    try {
      const orders = await Order.find()
      const id = req.query.id
      const product = await Product.findById({ _id: id })
      if (product) {
        const relatedProducts = await Product.find({ productCategory: product.productCategory }).limit(6)
        const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
        let cartCount;
        if (cart) {
          cartCount = cart.products.length
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
        res.render("user/view-product", { relatedProducts, user: req.session.user, product, cartCount, cart, orders, totalAmount })
      } else {
        res.redirect("/")
      }
    } catch {
      res.redirect("/not-found")
    }
  },
  postLogin: async (req, res) => {
    try {
      const body = req.body
      const userDetails = await User.findOne({ Email: body.Email })
      if (userDetails) {
        const password = await bcrypt.compare(
          body.password,
          userDetails.password
        )
        if (password) {
          isBlock = userDetails.isBlock
          if (!isBlock) {
            req.session.loggedIn = true
            req.session.user = userDetails
            res.redirect("/")
          } else {
            res.render("user/login", {
              err_msg: "You have been temporarily blocked by admin",
            })
          }
        } else {
          ails
          res.render("user/login", {
            err_msg: "Entered password is incorrect",
          })
        }
      } else {
        res.render("user/login", { err_msg: "Entered Email is incorrect" })
      }
    } catch {
      res.redirect("/not-found")
    }
  },
  signup: (req, res) => {
    try {
      res.render("user/register", { err_msg: false, user: false })
    } catch (err) {
      res.redirect("/not-found")
    }
  },
  doSignup: async (req, res) => {
    try {
      const user = await User.find({ Email: req.body.Email })
      const userWithPhone = await User.findOne({ phone: req.body.phone })
      let err_msg = ""
      if (user[0]) {
        err_msg = "This email is already registered"
        res.render("user/register", { err_msg })
      } else if (userWithPhone) {
        err_msg = "This mobile number is already registered"
        res.render("user/register", { err_msg })
      } else if (req.body.password !== req.body.confirmPassword) {
        err_msg = "Password and confirm password must be same"
        res.render("user/register", { err_msg })
      } else {
        const userDetails = req.body
        const number = parseInt(userDetails.phone)
        checkOtp.sendOtp(number)
        userSignup = userDetails
        res.redirect("/get-otp")
      }
    } catch (err) {
      console.log(err);
      res.redirect("/not-found")
    }
  },
  otpPage: async (req, res) => {
    res.render("user/otp-page", { errorMsg: false })
  },
  otpVerification: async (req, res) => {
    let Otp = req.body
    const OTP = Otp.otp
    const userDetails = userSignup
    const number = parseInt(userDetails.phone)
    let otpStatus = await checkOtp.verifyOtp(number, OTP)
    if (otpStatus.valid) {
      userDetails.password = await bcrypt.hash(userDetails.password, 10)
      await User.create(userDetails)
      req.session.user = userDetails
      req.session.loggedIn = true
      res.redirect("/")
    } else {
      res.render("user/otp-page", { errorMsg: "Entered OTP is incorrect" })
    }
  },
  profile: async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(req.session.user._id) })
      let cartCount;
      if (cart) {
        cartCount = cart.products.length
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
      console.log(typeof (addresses));
      res.render('user/profile', { user: req.session.user, cartCount, cart, addresses, totalAmount })
    } catch (err) {
      console.log(err);
      res.redirect('/not-found')
    }
  },
  logout: (req, res) => {
    req.session.loggedIn = false
    res.redirect("/")
  },
  usersList: async (req, res) => {
    try {
      const users = await User.find()
      res.render("admin/users-list", { users })
    } catch {
      res.redirect("/admin/not-available")
    }
  },
  blockUser: async (req, res) => {
    try {
      const id = req.query.id
      await User.updateOne({ _id: id }, { isBlock: true })
      res.redirect("/admin/users-list")
    } catch {
      res.redirect("admin/not-available")
    }
  },
  unBlockUser: async (req, res) => {
    try {
      const id = req.query.id
      await User.updateOne({ _id: id }, { isBlock: false })
      res.redirect("/admin/users-list")
    } catch {
      res.redirect("admin/not-available")
    }
  },
}
