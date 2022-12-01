const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    isBlock:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)
const user = mongoose.model("user",userSchema)
module.exports = user