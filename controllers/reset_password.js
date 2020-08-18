const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendmail } = require('../controllers/sendEmail');

module.exports = {
  reset_password: function(req, res) {
    var subject = "Password Changed Successfully";

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user){
      if(!user){
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
      }
      if(req.body.password === req.body.confirm){
        var body = `<p>Hello,<br>
              This is a confirmation that the password for your account ${user.email} has just been changed.<br></p>`;
        sendmail(user.email, subject, body);
        //Hash password
        bcrypt.genSalt(10, (err, salt)=>{
          bcrypt.hash(req.body.password, salt, (err, hash)=>{
            if(err) throw err;
            user.password = hash;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            //Save user
            user.save()
              .then(user => {
                req.flash('success_msg', 'Password has been changed successfully. You can now login');
                res.redirect('/user/login');
              })
              .catch(err => console.log(err));
          })
        });
      }else{
        req.flash("error_msg", "Passwords do not match.");
        return res.redirect('back');
      }
    });
  }
}
