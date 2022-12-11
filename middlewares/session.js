const mongoose = require('mongoose')
const User = require('../models/userSchema')

module.exports = {
    sessionUser : async (req,res,next) => {
        try{
            if(req.session.loggedIn){
                const user = req.session.userDetails
                next()
            }else{
                res.redirect('/login')
            }
        }catch (err) {
            res.redirect('/not-found')
        }
        
    },
    sessionAdmin : async (req,res,next) => {
        
        try{ 
            if(req.session.adminLoggedIn){
                next()
            }else{
                res.redirect('/admin/login')
            }
        }catch (err) {
            res.redirect('/admin/not-available')
        }
    }
}