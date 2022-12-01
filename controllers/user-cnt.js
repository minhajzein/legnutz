const User = require('../models/userSchema')
const bcrypt = require ('bcrypt')
const checkOtp = require ('../utils/otp-auth')

module.exports = {
    errorPage: async (req,res)=>{
        res.render('user/404')
    },
    home: async (req,res)=> {
        try{
            res.render('user/home')
        }catch (err) {
            res.redirect('/not-found')
        }
    },
    signup: (req,res)=>{
        try{
            if(req.session.loggedIn){
                res.redirect('/')
            }else{
                res.render('user/register',{err_msg:false})
            }
        }catch (err) {
            res.redirect('/not-found')
        }
    },
    doSignup: async (req,res)=>{
        try{
            const user = await User.find({Email:req.body.Email})
            const userWithPhone = await User.findOne({phone:req.body.phone})
            let err_msg = ''
            if(user[0]){
                err_msg = 'This email is already registered'
                res.render('user/register',{err_msg:err_msg})
            }else if(userWithPhone){
                err_msg = 'This mobile number is already registered'
                res.render('user/register',{err_msg:err_msg})
            }else if(req.body.password !== req.body.confirmPassword){
                err_msg = 'Password and confirm password must be same'
                res.render('user/register',{err_msg:err_msg})
            }else{
                return new Promise ( async (resolve,reject) => {
                    const userDetails = req.body
                    const number = parseInt(userDetails.phone)
                    checkOtp.sendOtp(number)
                    console.log(userDetails);
                    res.render('user/otp-page',{userDetails})
                })
            }
        }catch (err){
            console.log(err);
            res.redirect('/not-fount')
        }
        
    },
    otpPage: (req, res) => {
        res.render('user/otp-page',{errorMsg:false})
    },
    otpVerification: async (req, res) => {
        let otp = req.body
        otp = otp.join()
        otp = otp.split(',').join('') 
        const userDetails = req.session.userDetails
        const number = parseInt(userDetails.phone)
        const otpStatus = checkOtp.verifyOtp(number)
        if(otpStatus.valid) {
            userDetails.password = await bcrypt.hash(userDetails.password,10)
            const user = await User.create(userDetails)
            req.session.loggedin = true
            req.session.user = user._id
            res.redirect('/')
        }else{ 
            res.render('user/otp-page',{errorMsg:'Entered OTP is incorrect'})
        }
    },
    otpVerification: (req,res) => {

    }
}