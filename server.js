const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const applicationsController = require('./controllers/applications.js')
const isSignedIn = require('./middleware/is-signed-in.js');


const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({ //creates a session object& session cookie to the browser
    secret: process.env.SESSION_SECRET, //the key to unlock the cookies w/c are user info/id using the SEESION SEC via .env
    resave: false,
    saveUninitialized: true,
  })
);

//passUserView comes after session middleware but beofre homepage
app.use(passUserToView); // use new passUserToView middleware here

app.get('/', (req, res) => {
  // Check if the user is signed in
  if (req.session.user) {
    // Redirect signed-in users to their applications index
    res.redirect(`/users/${req.session.user._id}/applications`); //hackerman's id: req.session.user._id
  } else {
    // Show the homepage for users who are not signed in
    res.render('index.ejs');
  }
});


app.use('/auth', authController);

app.use(isSignedIn)
//this middleware runs after auth routes - the user need to authenticate
app.use('/users/:userId/applications', applicationsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
