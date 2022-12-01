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
            res.render('user/register')
            if(req.session.loggedIn){
                res.redirect('/')
            }else{
                res.render('user/register')
            }
        }catch (err) {
            res.redirect('/not-found')
        }
    },
    doSignup: async (req,res)=>{
        try{
            let user = await User.find({Email:req.body.Email})
            let userWithPhone = await User.findOne({phone:req.body.phone})
            if(user[0]){
                res.json({status : 'This email is already registered'})
            }else if(userWithPhone){
                res.json({status: 'This mobile number is already registered'})
            }else if(req.body.password !== req.body.confirmPassword){
                res.json({status: 'Password and confirm password must be same'})
            }else{
                return new Promise ( async (resolve,reject) => {
                    const username = req.body.username
                    const Email = req.body.Email
                    const phone = req.body.phone
                    const password = await bcrypt.hash(req.body.password,10)
                    const number = parseInt(phone)

                    const user = new User({
                        username:username,
                        Email:Email,
                        phone:phone,
                        password:password,
                        verification: 'pending',
                        createdDate: new Date()
                    })

                    mobileNum = number

                    user
                        .save()
                        .then((result) => {
                            userSession = result
                            userDetails = result
                            userSession.password = null
                            checkOtp.sendOtp(number)
                            res.json({status:true})
                        })
                        .catch((error)=>{
                            console.log(error);
                        })

                })
            }
        }catch (err){
            console.log(err);
            res.redirect('/not-fount')
        }
        
    }
}