var express = require('express');
var router = express.Router();
const userSchema = require('../models/userSchema');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('../utils/auth.middileware');

passport.use(new LocalStrategy(userSchema.authenticate()));
/* GET home page. */

router.get('/register', (req, res) => {
  res.render('register', { user: req.user });
});

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    await userSchema.register({ username, email }, password);
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/profile', isLoggedIn, async (req, res, next) => {
  try {
    res.render('profile', { user: req.user });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/',
  }),
  async (req, res) => {}
);

router.get('/logout', isLoggedIn, async (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
