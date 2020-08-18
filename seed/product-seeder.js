const Product = require('../models/product');

const mongoose = require('mongoose');

const db = require('../config/keys').MongoURI;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=> console.log('MongoDB connected'))
  .catch(err=>console.log(err));

var products = [
  new Product({
    imagePath: '/images/strawberries.jpg',
    title: 'Strawberry Cake',
    description: 'Deserts',
    category: 'Deserts',
    price: 10
  }),
  new Product({
    imagePath: '/images/strawberries.jpg',
    title: 'Strawberry Cake',
    description: 'Deserts',
    category: 'Beverages',
    price: 10
  }),
  new Product({
    imagePath: '/images/strawberries.jpg',
    title: 'Strawberry Cake',
    description: 'Deserts',
    category: 'Deserts',
    price: 10
  }),
  new Product({
    imagePath: '/images/strawberries.jpg',
    title: 'Strawberry Cake',
    description: 'Deserts',
    category: 'Deserts',
    price: 10
  })
];

var done = 0;
for(var i=0; i< products.length; i++){
  products[i].save(function(err, result){
    done++;
    if(done === products.length){
      exit();
    }
  });
}

function exit(){
  mongoose.disconnect();
}

Product.find({}, function(err, data){
  console.log(">>>> " + data );
});
