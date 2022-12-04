const mongoose = require('mongoose')
const User = require('../models/userSchema')

module.exports = {
    sessionUser : async (req,res,next) => {
        try{
            const session = req.session.loggedIn
            if(session){
                next()
            }else{
                res.redirect('/admin/login')
            }
        }catch (err){
            res.redirect('/admin/not-available')
        }
        
    },
    sessionAdmin : async (req,res,next) => {
        
        try{
            const session = req.session.adminLoggedIn
            if(session){
                next()
            }else{
                res.redirect('/admin/login')
            }
        }catch{
            res.redirect('/admin/not-available')
        }
    }
}