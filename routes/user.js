const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-cnt')
const userCheck = require('../middleware/session')
const cart = require('../controllers/cart-cnt')

//=======================================================================================================

router.get('/', controller.home)

router.get('/go-to-shop', controller.goToShop)

router.get('/orderList', userCheck.sessionUser, controller.orderList)

router.get('/coupons', userCheck.sessionUser, controller.coupons)

router.get('/wishlist', userCheck.sessionUser, controller.wishlist)
router.post('/addToWishlist', userCheck.sessionUser, controller.addToWishlist)
router.get('/deleteFromWish', userCheck.sessionUser, controller.deleteFromWish)

router.get('/productDetails', controller.productDetails)

router.get('/cartPage', userCheck.sessionUser, cart.goToCart)
router.get('/addToCart', userCheck.sessionUser, cart.addToCart)
router.post('/changeQuantity', userCheck.sessionUser, cart.quantityScale)
router.post('/removeItem', userCheck.sessionUser, cart.removeItem)


router.get('/checkOut', userCheck.sessionUser, cart.checkOut)
router.post('/applyCoupon', userCheck.sessionUser, cart.applyCoupon)
router.post('/placeOrder', userCheck.sessionUser, cart.placeOrder)
router.post('/verifyPayment', userCheck.sessionUser, cart.verifyPayment)
router.get('/successPage', userCheck.sessionUser, cart.successPage)

router.route('/login')
    .get(controller.loginPage)
    .post(controller.postLogin)

router.route('/register')
    .get(controller.signup)
    .post(controller.doSignup)

router.get('/profile', userCheck.sessionUser, controller.profile)

router.get('/get-otp', controller.otpPage)

router.post('/verify-otp', controller.otpVerification)

router.get('/logout', controller.logout)

router.get('/not-found', controller.errorPage)


//====================================================================================================================

module.exports = router;