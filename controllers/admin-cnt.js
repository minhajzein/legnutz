const { default: mongoose } = require('mongoose')
const Admin = require('../models/adminSchema') 


module.exports = {
    logIn : async (req,res)=>{
        if(req.session.admin){
            res.redirect("admin/home")
        }else{
            res.redirect("/admin")
        }
    }
}

