
const { render } = require('ejs')
const { default: mongoose } = require('mongoose')
const Admin = require('../models/adminSchema')
const Category = require('../models/categorySchema')

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
    },
    categoryPage : async (req,res) => {
        try{
            const categories = await Category.find()
            res.render('admin/category',{categories,err_msg:false})
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    addCategory : async (req,res) => {
        try{
            const existCategory = await Category.findOne({category:req.body.category})
            if(existCategory){
                const categories = await Category.find()
                res.render('admin/category',{categories,err_msg:`${existCategory} is already existed`})
            }else{
                const categories = {
                    category : req.body.category
                }
                await Category.create(categories)
                res.redirect('/admin/category-page')
            }
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    deleteCategory : async (req,res) => {
        try{

        }catch{

        }
    }
}

