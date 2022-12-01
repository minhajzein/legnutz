require('dotenv').config()
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')

const logger = require('morgan')
const session = require('express-session')
const mongoose = require('mongoose')
const mongodbConnect = require('./connections/mongodbConnection')()
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const path = require('path')
const Admin = require('./models/adminSchema')

//======================================================================

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('layout','layouts/layout')
app.use(expressLayout)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRouter)
app.use('/',userRouter)

app.use(session({
    secret:"legnutz",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:600000
    }
}))

app.use(function(req, res, next) {
    next(createError(404));
  });

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.render('error');
});

//=================================================================================================

app.listen(process.env.PORT || 3005)