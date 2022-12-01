const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-cnt')

//=======================================================================================================

router.get('/',controller.home)

router.get('/go-to-shop',(req,res)=>{
    res.render('user/go-to-shop')
})

router.route('/register')
    .get(controller.signup)
    .post(controller.doSignup)

router.get('/not-found',controller.errorPage)


//====================================================================================================================

module.exports = router ;