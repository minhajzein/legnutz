const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-cnt')
const userCheck = require('../middlewares/session')

//=======================================================================================================

router.get('/',controller.home)

router.get('/go-to-shop',(req,res)=>{
    res.render('user/go-to-shop')
})

router.route('/login')
    .get(controller.login)
    .post(controller.postLogin)

router.route('/register')
    .get(controller.signup)
    .post(controller.doSignup)

router.get('/get-otp',controller.otpPage)
    
router.post('/verify-otp',controller.otpVerification)

router.get('/logout',controller.logout)

router.get('/not-found',controller.errorPage)


//====================================================================================================================

module.exports = router ;