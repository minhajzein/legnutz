const express = require('express')
const router = express.Router()
const userControl = require('../controllers/user-cnt')
const control = require('../controllers/admin-cnt')
const checkSession = require('../middleware/session')
const productControl = require('../controllers/product-cnt')
const fileupload = require('../middleware/multer')

//==========================================================================================

router.get('/', checkSession.sessionAdmin, control.home)

router.get('/orderManage', checkSession.sessionAdmin, control.orderManage)

router.route('/login')
    .get(control.login)
    .post(control.postLogin)

router.get('/users-list', checkSession.sessionAdmin, userControl.usersList)

router.post('/shipped', checkSession.sessionAdmin, control.statusToShipped)
router.post('/delivered', checkSession.sessionAdmin, control.statusToDelivered)

router.get('/block-user', checkSession.sessionAdmin, userControl.blockUser)

router.get('/unBlock-user', checkSession.sessionAdmin, userControl.unBlockUser)

router.route('/addProduct')
    .get(productControl.addProduct)
    .post(fileupload.uploadImages, fileupload.resizeImages, productControl.postAddproduct)

router.get('/productList', checkSession.sessionAdmin, productControl.getProductList)

router.get('/couponList', checkSession.sessionAdmin, control.couponList)

router.route('/createCoupon')
    .get(checkSession.sessionAdmin, control.couponCreationPage)
    .post(checkSession.sessionAdmin, control.createCoupon)

router.route('/editProduct')
    .get(productControl.editPage)
    .post(fileupload.uploadImages, fileupload.resizeImages, productControl.editProduct)
router.get('/category-page', control.categoryPage)

router.get('/deleteProduct', productControl.deleteProduct)

router.post('/add-category', control.addCategory)

router.get('/deleteCategory', control.deleteCategory)

router.get('/logout', control.logout)

router.get('/not-available', control.errPage)

//==========================================================================================

module.exports = router;