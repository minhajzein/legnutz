const express = require('express')
const router = express.Router()
const userControl = require('../controllers/user-cnt')
const control = require('../controllers/admin-cnt')
const checkSession = require ('../middlewares/session') 
const productControl = require('../controllers/product-cnt')

//==========================================================================================

router.get('/',control.home)


router.route('/login')
    .get(control.login)
    .post(control.postLogin)

router.route('/addProduct')
    .get(productControl.addProduct)
    .post(productControl.postAddproduct)

router.get('/productList',productControl.getProductList)

router.get('/logout',control.logout)

router.get('/not-available',control.errPage)

//==========================================================================================

module.exports = router ;