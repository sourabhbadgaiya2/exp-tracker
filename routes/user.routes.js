var express = require('express');
var router = express.Router();
const userSchema = require('../models/userSchema');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(userSchema.authenticate()));
/* GET home page. */

router.get('/register', (req, res) => {
  res.render('register');
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

module.exports = router;
