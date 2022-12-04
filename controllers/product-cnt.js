const Product = require('../models/productSchema')

module.exports = {
    addProduct : (req,res) => {
        try{
            console.log("aaa");
            res.render('admin/add-product')
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    postAddproduct : (req,res) => {
        try{
            const productDetails = {

            }
        }catch{

        }
    }
}