const express = require('express')
const router = express.Router()
const userControl = require('../controllers/user-cnt')
const control = require('../controllers/admin-cnt')
const productControl = require('../controllers/product-cnt')

//==========================================================================================

router.get('/')

router.post('/login')

router.get('/logout')

//==========================================================================================

module.exports = router ;