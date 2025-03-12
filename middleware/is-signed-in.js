// middleware/is-signed-in.js

const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  // if the user is signed in; call the next middleware function
  res.redirect('/auth/sign-in');
};

module.exports = isSignedIn;
