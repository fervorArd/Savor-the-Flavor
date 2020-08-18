const User = require('../models/User');
const multer = require('multer');
const path = require('path');

module.exports = {
  updateAccountInfo: function(req, res){
    //Storage engine
    const storage = multer.diskStorage({
      destination: './public/uploads/',
      filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
      }
    });

    let upload = multer({
      storage: storage,
      fileFilter: checkFileType,
    }).single('profile-pic');

    upload(req, res, (err)=>{
      if(err) res.render('user/account', { errors: [{msg: err}],  imagePath: req.user.imagePath, mobile_number: req.user.mobile_number, name: req.user.name, email: req.user.email});
      else{
        var filename, errors = [];
        if(typeof req.file === 'undefined') filename = req.user.imagePath;
        else filename = `/uploads/${req.file.filename}`;

        var { mobile_number, name, email } = req.body;
        if(validateOnSubmit(errors, mobile_number, name, email)){
          var newvalues = { $set: {imagePath: filename, mobile_number: mobile_number, name: name, email: email } };
          User.updateOne({ _id: req.user }, newvalues, (err, user) => {
            if (err) throw err;
            res.render('user/account', { imagePath: filename?filename:req.user.imagePath, mobile_number: mobile_number, name: name, email: email, success_msg: 'Account has been updated' });
          });
        }else{
          res.render('user/account', {errors: errors, imagePath: req.user.imagePath, name: req.user.name, email: req.user.email});
        }
      }
    });
  }
}

//Function checkFileType
const checkFileType = function(req, file, cb){
  const filetypes = /jpeg|jpg|gif|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname) return cb(null, true);
  else cb('Error: Images only');
}

const validateOnSubmit = function(errors, mobile_number, name, email){
  if(!mobile_number|| !name || !email)
    errors.push({msg: "Please fill in all fields"});

  if(mobile_number.toString().length != 10)
    errors.push({msg: "Phone number must be of 10 digits"});

  return (errors.length > 0) ? false: true;
}
