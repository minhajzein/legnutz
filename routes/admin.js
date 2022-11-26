const express = require('express')
const router = express.Router()

//==========================================================================================

router.get('/',(req,res)=>{
    res.render('admin/login')
})

router.get('/home',(req,res)=>{
    res.render('admin/home',{admin:true})
})

router.get('/logout',(req,res)=>{
    res.redirect('/admin')
})

//==========================================================================================

module.exports = router ;