const mongoose = require('mongoose')
const User = require('../models/userSchema')

module.exports = {
    sessionUser : async (req,res,next) => {
        try{
            const session = req.session.loggedIn
            if(session){
                userDetails = req.session.userDetails
                next()
            }else{
                res.redirect('/login')
            }
        }catch (err){
            res.redirect('/not-found')
        }
        
    },
    sessionAdmin : async (req,res,next) => {
        
        try{
            const session = req.session.adminLoggedIn
            if(session){
                adminData = req.session.adminData
                next()
            }else{
                res.redirect('/admin/login')
            }
        }catch{
            res.redirect('/admin/not-available')
        }
    }
}