const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

module.exports = {
  forgot_password:  function(req, res, next){
      async.waterfall([
      function(done){
        crypto.randomBytes(20, function(err, buf){
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done){
        User.findOne({ email: req.body.email }, function(err, user){
          if(!user){
            req.flash('error_msg', 'No account with that email address exists.');
            return res.redirect('/user/forgot-password');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000;

          user.save(function(err){
            done(err, token, user);
          });
        });
      },
      function(token, user, done){
        var smtpTransport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: 'restaurantapp8530@gmail.com',
            pass: 'lur8tlur8t',
          },
          tls: {
            rejectUnathorized: false
          }
        });

        var mailOptions = {
          to: user.email,
          from: '"Restaurant App" <restaurantapp8530@gmail.com>',
          subject: 'Reset Password Request',
          text: `You are receiving this because you have requested the reset of the password.
          \nPlease click on the following link, or paste this into your browser to complete the process.
          \nhttp://${req.hostname}:5000/user/reset/${token}.\n\n
          \n\nIf you did not request this, please ignore this email and your password will remain unchanged`
        };

        smtpTransport.sendMail(mailOptions, function(err){
          console.log('Mail sent');
          req.flash('success_msg', 'An email has been sent to ' + user.email + ' with further instructions');
          res.redirect('/user/forgot-password');
          done(err, 'done');
        });
      }
    ], function(err){
      if(err) return next(err);
      req.flash('success_msg', 'An email has been sent to ' + user.email + ' with further instructions');
      res.redirect('/user/forgot-password');
    });
  }
}
