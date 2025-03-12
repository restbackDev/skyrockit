// controllers/applications.js

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// GET /users/:userId/applications
router.get('/', async (req, res) => { //we are adding async due to waiting in the database
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('applications/index.ejs', {
      applications: currentUser.applications
    });
    //pass the current user's app in the index page
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// GET /user/:userId/applications/new
router.get('/new', async (req, res) => {
  res.render('applications/new.ejs');
});

//POST /users/:userId/applications/
router.post('/', async (req,res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.push(req.body);
    // this changes the application list in memory ONLY - NOT in the database
    await currentUser.save(); // this makes the changes permanent in the database
    res.redirect(`/users/${currentUser._id}/applications`)
  } catch (error) {
    console.log(error)
    res.redirect('/');
  }
});

module.exports = router;
