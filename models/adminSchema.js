const mongoose = require("mongoose")
const adminSchema = new mongoose.Schema({
    adminName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
})
const admin = mongoose.model('admin',adminSchema)
module.exports = admin

