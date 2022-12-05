const Product = require('../models/productSchema')

module.exports = {
    addProduct : (req,res) => {
        try{
            res.render('admin/add-product')
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    postAddproduct : async (req,res) => {
        try{
            const productDetails = {

            }
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    getProductList : (req,res) => {
        try {
            res.render('admin/product-list')
        } catch (error) {
            console.log(error);
        }
    }
}

