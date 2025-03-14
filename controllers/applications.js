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

// GET /users/:userId/applications/:applicationId
router.get('/:applicationId', async (req,res) => {
  try {
    // look up the user that's currently logged in
    const currentUser = await User.findById(req.session.user._id);
    // find the subdocument in the currently logged in user's applications list
    const application = currentUser.applications.id(req.params.applicationId);
    //render a show template with the sub-document's details
    res.render('applications/show.ejs', {
      application 
      // property shorthand syntax whenever the prop name and variable
      // name holding the value are the same
    });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:applicationId', async (req,res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Use the Mongoose .deleteOne() method to delete
    // an application using the id supplied from req.params
    currentUser.applications.id(req.params.applicationId).deleteOne();
    // ^ this makes the change in history
    // Save changes to the user
    await currentUser.save() // this makes the change in the database
    // Redirect back to the applications index view
    res.redirect(`/users/${currentUser._id}/applications`)
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');

  }
})

// GET /users/:userId/applications/edit
router.get('/:applicationId/edit', async (req,res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render('applications/edit.ejs', {
      application //or type (its the same) --> application: application
    });

  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})


// update route
// PUT /users/:userId/applications/:applicationId
router.put('/:applicationId', async (req,res) => {
  try {
    const currentUser = await User.findById(req.session.user_id);
    const application = currentUser.applications.id(req.params.applicationId);
    application.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/applications/${req.params.applicationId}`)
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
})

module.exports = router;
