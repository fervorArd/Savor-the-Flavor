const Product = require('../models/product');

module.exports = {
  addProduct: function(req, res){
    var { imagePath, title, description, category, price } = req.body;
    if(!imagePath || !title || !description || !category || !price){
      return res.render('admin/add-product', {error: 'All fields are required'});
    }
    var newProduct = new Product({imagePath, title, description, category, price});
    //Save user
    newProduct.save()
      .then(product => {
        req.flash('success_msg', 'Product added successfully.');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(err));
  }
}
