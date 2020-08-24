const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const Order = require('../models/orders');
const Cart = require('../models/cart');
const Product = require('../models/product');
const { validationCheck } = require('../controllers/form_validation');
const { updateAccountInfo } = require('../controllers/updateAccountInfo');
const { forgot_password } = require('../controllers/forgot_password');
const { reset_password } = require('../controllers/reset_password');
const { ensureAuthenticated } = require('../config/auth');
const csurf = require('csurf');
var ObjectId = require('mongodb').ObjectID;

var csrfProtection = csurf({ cookie: true });

router.get('/signup', csrfProtection, (req, res) => {
  res.render('user/signup', { csrfToken: req.csrfToken() });
});

router.post('/signup', validationCheck);

router.get('/login', csrfProtection, (req, res)=>{
  res.render('user/login', { csrfToken: req.csrfToken() });
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true
  }), (req, res, next) => {
    if(req.session.oldUrl && req.session.oldUrl !== '/user/account'){
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    }else if(!req.user.isAdmin){
      res.redirect('/user/account');
    }else{
      res.redirect('/admin/orders');
    }
});

router.get('/account', ensureAuthenticated, (req, res)=>{
  User.findOne({ _id: req.user }, (err, user) => {
    if(user){
      res.render('user/account', { imagePath: user.imagePath, name: user.name, email: user.email, mobile_number: user.mobile_number });
    }
    if(err){
      req.flash('error_msg', 'You have not register.Please register to view this page.');
      res.redirect('/user/signup');
    }
  });
});

router.post('/account', updateAccountInfo);

router.get('/my-orders', ensureAuthenticated, (req, res)=>{
  Order.find({ user: req.user }, (err, orders) => {
    if(orders.length > 0){
      orders.forEach((order) => {
        var cart;
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render('user/my-orders', { orders: orders });
    }else{
      res.render('user/my-orders', { orders: null });
    }
    if(err){
      req.flash('error_msg', err);
      res.redirect('/shop/menu');
    }
  }).sort({ date: -1 });
});

//Logout handle
router.get('/logout', (req, res) => {
  req.session.cart = null;
  req.logout();
  req.flash('success_msg', 'You are logged out');
  return res.redirect('/');
});

router.get('/forgot-password', (req, res) => {
  res.render('user/forgot-password');
});

router.post('/forgot-password', forgot_password);

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
    if(!user){
      req.flash('error_msg', 'Password reset token is invalid or has expired.');
      return res.redirect('/user/forgot-password');
    }
    res.render('user/reset', { token: req.params.token });
  });
});

router.post('/reset/:token', reset_password);

//Displaying favorites
router.get('/myfavorites', ensureAuthenticated, (req, res) => {
  User.findOne({_id: req.user}, function(err, user){
    if(err){
      req.flash('error_msg', 'User not found');
      return res.redirect('/');
    }
    if(user.favorite_list.length > 0){
      res.render('user/myfavorites', {favorite_list: user.favorite_list});
    }else{
      res.render('user/myfavorites', {favorite_list: null})
    }
  });
});

//Adding to db
router.get('/add-to-favorite/:id', (req, res) => {
  var productId = req.params.id;

  Product.findById(productId, function(err, product){
    if(err) return res.redirect('/');
    User.findOne({_id: req.user}, function(err, user){
      if(err){
        req.flash('error_msg', 'An error occurred while adding the item to favorites');
        return res.redirect('/shop/menu');
      }
      if(user){
        user.favorite_list.push(product);
        user.save(function(err, result){
          if(err){
            req.flash('error_msg', 'Item cannot be added');
            return res.redirect('/shop/menu');
          }
          req.flash('success_msg', 'Added to favorites');
          res.redirect('/shop/menu');
        });
      }else{
        req.flash('error_msg', 'You are not Logged In.');
        return res.redirect('/shop/menu');
      }
    });
  });
});

router.get('/remove-from-favorite/:id', (req, res) => {
  var id = ObjectId(req.params.id);
  User.updateOne({_id: req.user}, {$pull: {favorite_list: {_id: id}}}, function(err, result){
    if(err) console.log(err);
  });
  req.flash('success_msg', 'Removed item from favorites.');
  res.redirect('/user/myfavorites');
});

router.get('/currentorder', (req, res) => {
  res.render('user/currentorder');
});

module.exports = router;
