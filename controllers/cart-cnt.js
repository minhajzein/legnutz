const Cart = require('../models/cartSchema')
const Product = require('../models/productSchema')
const User = require('../models/userSchema')

module.exports = {
    addToCart : async (req,res) => {
        try{
            const id = req.query.id
            const userId = req.query.userId
            const user = await User.findOne({_id:userId})
            const product = await Product.findById({_id:id})
            const cart = await Cart.findOne({user:user.username})
            if(cart){
                await Cart.updateOne(
                    {user:user.userName},
                    {
                        $push:{
                            products:product
                        }
                    }
                )
                res.redirect('/')
                console.log("added to cart");
            }else{
                await Cart.create({
                    user:user.username,
                    products:product
                })
                res.redirect('/')
                console.log("cart created");
            }
        }catch{
            res.redirect('/not-found')
        }
    }
}
