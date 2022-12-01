const express = require('express')
const router = express.Router()
const userControl = require('../controllers/user-cnt')
const control = require('../controllers/admin-cnt')
const checkSession = require ('../middlewares/session') 
const productControl = require('../controllers/product-cnt')

//==========================================================================================

router.get('/not-found',control.errPage)

router.get('/',checkSession.sessionAdmin,control.home)

router.post('/login',control.postLogin)

router.get('/logout',control.logout)

//==========================================================================================

module.exports = router ;