const express = require('express')
const router = express.Router()

//=======================================================================================================

router.get('/',(req,res)=>{
    res.render('user/home')
})

router.get('/go-to-shop',(req,res)=>{
    res.render('user/go-to-shop')
})

router.get('/register',(req,res)=>{
    res.render('user/register')
})

//====================================================================================================================

module.exports = router ;