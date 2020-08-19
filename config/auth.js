module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }else{
      req.session.oldUrl = `/user${req.url}`;
      req.flash('error_msg', 'Please log in to view this resources');
      res.redirect('/user/login');
    }
  },
  isLoggedin: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }else{
      req.session.oldUrl = `/shop${req.url}`;
      req.flash('error_msg', 'Please log in to view this resources');
      res.redirect('/user/login');
    }
  },
  adminLogin: function(req, res, next){
    if(req.isAuthenticated() && req.user.isAdmin){
      return next();
    }else{
      req.session.oldUrl = `/admin${req.url}`;
      req.flash('error_msg', 'Please log in to view this resources');
      res.redirect('/user/login');
    }
  }
}
