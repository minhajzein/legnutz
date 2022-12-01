const session = require('express-session')
const { default: mongoose } = require('mongoose')
const Admin = require('../models/adminSchema')



module.exports = {
    errPage : (res,req) => {
        res.render('admin/not-found')
    },
    home : async (req,res) => {
        try{
            res.render('admin/home')
        }catch{
            res.redirect("/not-found")
        }
    },
    postLogin : async (req,res) => {
        try{
            const enteredData = req.body
            const admin = Admin.findOne({})
        if(admin.password === Admin.findOne ){

            }
        }catch{

        }
    },
    logout : (req,res) => {
        session.destroy()
    }
}

