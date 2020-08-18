const Product = require('../models/product');

module.exports = {
  editProduct: function(req, res){
    var id = req.params.id;
    var { title, description, category, price,imagePath } = req.body;
    if(!imagePath || !title || !description || !category || !price){
      req.flash('error_msg', 'All fields are required');
      return res.redirect(`${id}`);
    }
    var newvalues = { $set: {imagePath: imagePath, title: title, description: description, category: category, price: price } };
    Product.updateOne({ _id: id }, newvalues, (err, product) => {
      if (err) throw err;
      req.flash('success_msg', 'Product details has been updated.');
      res.redirect(`${id}`);
    });
  }
}
