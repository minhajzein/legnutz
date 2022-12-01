const mongoose = require('mongoose')
const User = require('../models/userSchema')

module.exports = {
    sessionUser : async (req,res) => {
        if(req.session.loggedIn){
               next()
        }else{
            res.redirect('/login')
        }
    },
    sessionAdmin : async (req,res)=>{
        if(req.session.admin){
            res.redirect("admin/home")
        }else{
            res.redirect("/admin")
        }
    }
}