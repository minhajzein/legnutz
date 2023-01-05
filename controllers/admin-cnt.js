
const { render } = require('ejs')
const { default: mongoose } = require('mongoose')
const Admin = require('../models/adminSchema')
const Category = require('../models/categorySchema')
const Order = require('../models/orderSchema')
const Product = require('../models/productSchema')
const Coupon = require('../models/couponSchema')

module.exports = {
    errPage: (res, req) => {
        res.render('admin/not-available')
    },
    home: async (req, res) => {
        try {
            res.render('admin/home', { adminData: req.session.adminData })
        } catch {
            res.redirect("/admin/not-available")
        }
    },
    login: async (req, res) => {
        try {
            res.render('admin/login', { err_msg: false })
        } catch {
            res.redirect("/admin/not-available")
        }
    },
    postLogin: async (req, res) => {
        try {
            const adminData = await Admin.findOne({ Email: req.body.Email })
            if (adminData) {
                if (adminData.password == req.body.password) {
                    req.session.adminLoggedIn = true
                    req.session.adminData = adminData
                    res.redirect('/admin')
                } else {
                    res.render('admin/login', {
                        err_msg: "Password is incorrect"
                    })
                }
            } else {
                res.render('admin/login', {
                    err_msg: 'Entered Email is not valid'
                })
            }
        } catch {
            res.redirect('/admin/not-available')
        }
    },
    logout: (req, res) => {
        req.session.adminLoggedIn = false
        res.redirect('/admin/login')
    },
    categoryPage: async (req, res) => {
        try {
            const categories = await Category.find()
            res.render('admin/category', { categories, err_msg: false, adminData: req.session.adminData })
        } catch {
            res.redirect('/admin/not-available')
        }
    },
    addCategory: async (req, res) => {
        try {
            const existCategory = await Category.findOne({ category: req.body.category })
            if (existCategory) {
                const categories = await Category.find()
                res.render('admin/category', { categories, err_msg: `${existCategory} is already existed` })
            } else {
                const categories = {
                    category: req.body.category
                }
                await Category.create(categories)
                res.redirect('/admin/category-page')
            }
        } catch {
            res.redirect('/admin/not-available')
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const category = await Category.findById({ _id: req.query.id })
            const listedIn = await Product.findOne({ productCategory: category.category })
            if (listedIn) {
                const categories = await Category.find()
                res.render('admin/category', { categories, err_msg: `Cannot delete ${category.category} category, some products still in this category` })
            } else {
                await Category.deleteOne({ _id: req.query.id })
                res.redirect('/admin/category-page')
            }
        } catch {
            res.redirect('/admin/not-available')
        }
    },
    orderManage: async (req, res) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 })
            res.render('admin/order-management', { orders, adminData: req.session.adminData })
        } catch (err) {
            console.log(err);
            res.redirect('/admin/not-available')
        }
    },
    statusToShipped: async (req, res) => {
        try {
            const date = new Date()
            const statusObj = {
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString(),
                status: 'shipped'
            }
            const order = await Order.findById(req.body.orderId)
            if (order.orderStatus == 'placed') {
                await Order.updateOne({ _id: mongoose.Types.ObjectId(req.body.orderId) }, {
                    $set: {
                        orderStatus: 'shipped'
                    }
                })
                await Order.updateOne({ _id: mongoose.Types.ObjectId(req.body.orderId) }, {
                    $push: {
                        trackOrder: statusObj
                    }
                })
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        } catch (err) {
            console.log(err);
            res.redirect('/admin/not-available')
        }
    },
    statusToDelivered: async (req, res) => {
        try {
            const date = new Date()
            const statusObj = {
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString(),
                status: 'Delivered'
            }
            const order = await Order.findById(req.body.orderId)
            console.log(order.orderStatus);
            if (order.orderStatus == 'shipped') {
                await Order.updateOne({ _id: mongoose.Types.ObjectId(req.body.orderId) }, {
                    $set: {
                        orderStatus: 'delivered'
                    }
                })
                await Order.updateOne({ _id: mongoose.Types.ObjectId(req.body.orderId) }, {
                    $push: {
                        trackOrder: statusObj
                    }
                })
                res.json({ status: true })
            } else {
                res.json({ status: false })
            }
        } catch (err) {
            console.log(err);
            res.redirect('/admin/not-available')
        }
    },
    couponCreationPage: async (req, res) => {
        try {
            res.render('admin/create-coupon', { adminData: req.session.adminData })
        } catch (err) {
            console.log(err);
            res.redirect('/admin/not-available')
        }
    },
    createCoupon: async (req, res) => {
        try {
            console.log(req.body);
            await Coupon.create({
                couponTitle: req.body.couponTitle,
                couponCode: req.body.couponCode,
                couponStatus: 'active',
                couponType: req.body.couponType,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                quantity: req.body.quantity,
                amountOrPercent: req.body.amountOrPercent
            })
            res.redirect('/admin/couponList')
        } catch (err) {
            console.log(err);
            res.redirect('/admin/not-available')
        }
    },
    couponList: async (req, res) => {
        try {
            const coupons = await Coupon.find()
            res.render('admin/couponlist', { coupons, adminData: req.session.adminData })
        } catch (err) {
            console.log(err);
            res.redirect('/admin/not-available')
        }
    }
}

