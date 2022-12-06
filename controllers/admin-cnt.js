
const { render } = require('ejs')
const { default: mongoose } = require('mongoose')
const Admin = require('../models/adminSchema')


module.exports = {
    errPage : (res,req) => {
        res.render('admin/not-available')
    },
    home : async (req,res) => {
        try{
            if(req.session.adminLoggedIn){
                res.render('admin/home',{adminData:req.session.adminData})
            }else{
                res.redirect('/admin/login')
            }
        }catch{
            res.redirect("/admin/not-available")
        }
    },
    login : async (req,res) => {
        try{
            res.render('admin/login',{err_msg:false})
        }catch{
            res.redirect("/admin/not-available")
        }
    },
    postLogin : async (req,res) => {
        try{
            const adminData = await Admin.findOne({Email:req.body.Email})
            if(adminData){
                if(adminData.password==req.body.password){
                    req.session.adminLoggedIn = true
                    req.session.adminData = adminData
                    res.redirect('/admin')
                }else{
                    res.render('admin/login',{
                        err_msg:"Password is incorrect"
                    })
                }
            }else{
                res.render('admin/login',{
                    err_msg:'Entered Email is not valid'
                })
            }
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    logout : (req,res) => {
        req.session.adminLoggedIn = false
        res.redirect('/admin/login')
    }
}

