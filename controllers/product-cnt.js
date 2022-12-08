const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')
const fs = require('fs')

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
            await Product.create(productDetails)
            res.redirect('/admin/productList')
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
            const id = req.query.id
            const product = await Product.findById({_id:id})
            if(req.body.images==""||req.body.productDescription==""){
                await Product.updateOne(
                    {_id:id},
                    {$set:{
                        productName:req.body.productName,
                        productCategory:req.body.productCategory,
                        productPrice:req.body.productPrice,
                        oldPrice:req.body.oldPrice,
                        productBrand:req.body.productBrand,
                        productStock:req.body.productStock,
                        productDiscount:req.body.productDiscount,
                        productSize:req.body.productSize,
                        productColor:req.body.productColor
                    }

                })
            }else{
                const productImg = product.productImg
                for (let i=0;i<productImg.length;i++){
                    const imgPath = productImg[i]
                    fs.unlink('./public/images/'+imgPath,()=>{
                        console.log("Removed");
                    })
                }
                await Product.updateOne(
                    {_id:id},
                    {$set:{
                        productImg:req.body.images,
                        productName:req.body.productName,
                        productCategory:req.body.productCategory,
                        productPrice:req.body.productPrice,
                        oldPrice:req.body.oldPrice,
                        productBrand:req.body.productBrand,
                        productStock:req.body.productStock,
                        productDiscount:req.body.productDiscount,
                        productSize:req.body.productSize,
                        productColor:req.body.productColor,
                        productDescription:req.body.productDescription
                    }}
                    )

            }
            res.redirect('/admin/productList')
        }catch{
            res.redirect('/admin/not-available')
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const id = req.query.id;
            const productDelete = await Product.findById({ _id: id });
            console.log(productDelete);
            const productImg = productDelete.productImg;
            for (let i = 0; i < productImg.length; i++) {
                const imgPath = productImg[i];
                fs.unlink("./public/images/" + imgPath,() => {
                    console.log("Removed");
                });
            }
            console.log("=====================================");
            await Product.deleteOne(productDelete);
            res.redirect('/admin/productList')
        } catch (error) {
            console.log(error.message);
            res.redirect("/admin/not-available");
        }
    }
}

