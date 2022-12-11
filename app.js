require('dotenv').config()
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const cookieParser = require ('cookie')
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

app.use(session({
  secret:"ThisIsSecretKeyOflegnutz",
  resave:false,
  saveUninitialized:true,
  cookie:{
      maxAge:1000*60*60*24
  }
}))

app.use((req, res, next) => {
  res.set(
    "Cache-control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use(express.static(path.join(__dirname,'public')))

app.use('/admin',adminRouter)
app.use('/',userRouter)

app.use(function(req, res, next) {
    next(createError(404));
  });

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.render('error',{err});
});

//=================================================================================================

app.listen(process.env.PORT || 3005)