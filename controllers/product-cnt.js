const Product = require('../models/productSchema')

module.exports = {
    addProduct : async (req,res) => {
        try{
            const products = await Product.find()
            res.render('admin/add-product',{products})
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

