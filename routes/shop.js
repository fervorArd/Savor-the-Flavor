const express = require('express');
const router = express.Router();
const { isLoggedin } = require('../config/auth');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/orders');
const { sendmail } = require('../controllers/sendEmail');

router.get('/menu', (req, res)=>{
  Product.find(function(err, data){
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0; i<data.length; i+=chunkSize){
      productChunks.push(data.slice(i, i+chunkSize));
    }
    res.render('shop/menu', { products: productChunks });
  });
});

router.get('/add-to-cart/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err) return res.redirect('/shop/menu');
    cart.add(product, product.id);
    req.session.cart = cart;
    req.flash('success_msg', 'Added to the Cart.');
    res.redirect('/shop/menu');
  });
});


router.get('/add-to-cart-from-favorite/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err) return res.redirect('/shop/menu');
    cart.add(product, product.id);
    req.session.cart = cart;
    req.flash('success_msg', 'Added to the Cart.');
    res.redirect('/user/myfavorites');
  });
});

router.get('/reduce/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shop/shopping-cart');
});

router.get('/remove/:id', (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shop/shopping-cart');
});

router.get('/shopping-cart', (req, res) => {
  if(!req.session.cart || req.session.cart.totalQty === 0){
    return res.render('shop/shopping-cart', { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedin, (req, res) => {
  if(!req.session.cart){
    res.redirect('/shop/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', { total: cart.totalPrice });
});

router.post('/checkout', isLoggedin, (req, res) => {
  if(!req.session.cart){
    res.redirect('/shop/shopping-cart');
  }

  var cart = new Cart(req.session.cart);

  const Stripe = require('stripe');
  const stripe = Stripe('sk_test_51HBgT3G0e64EkmvjSOt6ZsP3PYobdQoEZ4tsyA5XWRkIPKwzG7Mkfmx4i1VT32DVASynRRhdefx7DINtk7RJVEe300bPwRgsuE');

  stripe.charges.create({
    amount: cart.totalPrice * 100, //Correct it //toFixed(0)
    currency: "inr",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge" //Idempotency
  }, function(err, charge) {
      if(err){
        req.flash('error_msg', err.message);
        return res.redirect('/shop/checkout');
      }
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
      });
      order.save((err, result) => {
        //Error
        req.flash('success_msg', 'Successfully bought product');
        req.session.cart = null;
        res.redirect('/shop/menu');
      });
  });

  var subject = "Order confirmed.";
  var html = '<p> Thank you for your purchase from [company name]. Thank you for being our valued customer. We are so grateful for the pleasure of serving you and hope we met your expectations.</p>';
  sendmail(req.user.email, subject, html);
});

module.exports = router;
