const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/orders');
var { addProduct } = require('../controllers/add_product');
var { editProduct } = require('../controllers/edit_product');
const { adminLogin } = require('../config/auth');
var ObjectId = require('mongodb').ObjectID;
const moment = require('moment');

router.use('/', adminLogin, function(req, res, next){
  next();
});

router.get('/products', (req, res) => {
  Product.find(function(err, data){
    res.render('admin/products', { products: data });
  });
});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product');
});

router.post('/add-product', addProduct);

router.get('/edit-product/:id', (req, res) => {
  var productId = req.params.id;
  Product.findById(productId, function(err, product){
    if(err) return res.redirect('/admin/products');
    var {title, description, category, price, imagePath} = product;
    res.render('admin/edit-product', { id: productId, title, description, category, price, imagePath});
  });
});

router.post('/edit-product/:id', editProduct);

router.get('/delete-product/:id', (req, res) => {
  var id = ObjectId(req.params.id);
  Product.deleteOne({ _id: id })
    .then(product => console.log(product));
  req.flash('success_msg', 'Removed product successfully.');
  return res.redirect('/admin/products');
});

router.get('/orders', (req, res) => {
  Order.find(function(err, orders){
    if(orders){
      res.render('admin/orders', { orders: orders, moment: moment });
    }else{
      res.render('admin/orders', { orders: null });
    }
  }).sort({ date: -1 });
});

module.exports = router;
