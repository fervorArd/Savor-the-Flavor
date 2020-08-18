const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res)=>{
  res.render('index/homepage');
});

router.get('/contact', (req, res)=>{
  res.render('index/contact');
});

router.get('/about', (req, res)=>{
  res.render('index/about');
});

module.exports = router;
