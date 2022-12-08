const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')

module.exports = {
    getProductList : async (req,res) => {
        try {
            const products = await Product.find()
            res.render('admin/product-list',{products})
        } catch (error) {
            console.log(error);
        }
    },
    addProduct : async (req,res) => {
        try{
            const categories = await Category.find()
            res.render('admin/add-product',{categories})
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    postAddproduct : async (req,res) => {
        try{
            const productDetails = {
                productName : req.body.productName,
                productDescription : req.body.productDescription,
                productCategory : req.body.productCategory,
                productPrice : req.body.productPrice,
                oldPrice : req.body.oldPrice,
                productImg : req.body.images,
                productBrand : req.body.productBrand,
                productStock : req.body.productStock,
                productDiscount : req.body.productDiscount,
                productSize : req.body.productSize,
                productColor : req.body.productColor
            }
            console.log(productDetails);
            await Product.create(productDetails)
            res.redirect('/admin/product-list')
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    editPage : async (req,res) => {
        try{
            const id = req.query.id
            const product = await Product.findById({_id:id})
            const categories = await Category.find()
            res.render('admin/edit-product',{product,categories})
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    editProduct : async (req,res) => {
        try{
            const updatedDetails = req.body
            console.log(updatedDetails);
        }catch{

        }
    }
}

