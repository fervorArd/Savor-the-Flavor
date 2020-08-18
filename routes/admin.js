const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Order = require('../models/orders');
var { addProduct } = require('../controllers/add-product');

router.get('/products', (req, res) => {
  Product.find(function(err, data){
    res.render('admin/products', { products: data });
  });
});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product');
});

router.post('/add-product', addProduct);

router.get('/orders', (req, res) => {
  Order.find(function(err, orders){
    if(orders){
      res.render('admin/orders', { orders: orders });
    }else{
      res.render('admin/orders', { orders: null });
    }
  });
});

module.exports = router;
