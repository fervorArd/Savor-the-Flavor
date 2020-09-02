const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const path = require('path');

const app = express();

//DB config
const db = require(path.join(__dirname, 'config/keys')).MongoURI;

//Passport config
require(path.join(__dirname, 'config/passport'))(passport);

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=> console.log('MongoDB connected'))
  .catch(err=>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//BodyParser
app.use(express.urlencoded({extended: true}));

//Express session middleware
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.session = req.session;
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/shop', require('./routes/shop'));
app.use('/admin', require('./routes/admin'));

app.use((req, res, next) => {
  res.status(404).render('errors/404');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server has been started on ${PORT}`));
