require('dotenv').config()
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const mongoose = require('mongoose')
const mongodbConnect = require('./connections/mongodbConnection')()
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const path = require('path')
const Admin = require('./models/adminSchema')

//======================================================================

app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(expressLayout)



app.use(session({
    secret:"legnutz",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:600000
    }
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRouter)
app.use('/',userRouter)

//=================================================================================================

app.listen(process.env.PORT || 3005)