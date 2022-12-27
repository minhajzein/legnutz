const express = require('express')
const router = express.Router()
const userControl = require('../controllers/user-cnt')
const control = require('../controllers/admin-cnt')
const checkSession = require('../middleware/session')
const productControl = require('../controllers/product-cnt')
const fileupload = require('../middleware/multer')

//==========================================================================================

router.get('/', control.home)

router.get('/orderManage', control.orderManage)

router.route('/login')
    .get(control.login)
    .post(control.postLogin)

router.get('/users-list', userControl.usersList)

router.get('/block-user', userControl.blockUser)

router.get('/unBlock-user', userControl.unBlockUser)

router.route('/addProduct')
    .get(productControl.addProduct)
    .post(fileupload.uploadImages, fileupload.resizeImages, productControl.postAddproduct)

router.get('/productList', productControl.getProductList)

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