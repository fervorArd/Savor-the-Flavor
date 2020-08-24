const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  validationCheck: function(req, res, next){
    const {mobile_number, name, email, password, password2} = req.body;

    let errors = [];

    if(!mobile_number|| !name || !email || !password || !password2)
      errors.push({msg: "Please fill in all fields"});

    if(mobile_number.toString().length != 10)
      errors.push({msg: "Phone number must be of 10 digits"});

    if(password !== password2)
      errors.push({msg: "Passwords do not match"});

    if(password.length < 6)
      errors.push({msg: "Password should be atleast 6 characters long"});

    if(errors.length > 0){
      res.render('user/signup', { errors, mobile_number, name, email, password, password2 });
    }else{
      User.findOne({ email: email })
        .then(user => {
          if(user){
            errors.push({msg: "User already Exist."});
            res.render('user/signup', { errors, mobile_number, name, email, password, password2 });
          }else{
            const newUser = new User({ mobile_number, name, email, password });
            //Hash password
            bcrypt.genSalt(10, (err, salt)=>{
              bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                newUser.password = hash;
                //Save user
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can login.');
                    res.redirect('/user/login');
                  })
                  .catch(err => console.log(err));
              })
            });
          }
      });
    }
  }
}
