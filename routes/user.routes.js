var express = require('express');
var router = express.Router();
const userSchema = require('../models/userSchema');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn } = require('../utils/auth.middileware');
const upload = require('../utils/multer');
const fs = require('fs');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new LocalStrategy(userSchema.authenticate()));

/* GET home page. */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/user/auth/google/callback',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    function (accessToken, refreshToken, profile, cb) {
      userSchema.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
// ----------------------------------------------
router.get('/', (req, res) => {
  res.send('<h1>Home</h1><a href="/user/auth/google">Login with Google</a>', {
    user: req.user,
  });
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/user/profile');
  }
);

// router.get('/profile', (req, res) => {
//   res.send(`<h1>Profile</h1><pre>${JSON.stringify(req.user, null, 2)}</pre>`);
// });
// ---------------------------------
// account register
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', user: req.user });
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    await userSchema.register({ name, username, email }, password);
    req.flash('Success', 'Account is Created');
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// user profile
router.get('/profile', isLoggedIn, async (req, res, next) => {
  try {
    res.render('profile', {
      title: 'Profile',
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

//Login
router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/',
  }),
  async (req, res, next) => {}
);

//Logout
router.get('/logout', isLoggedIn, async (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// user update
router.get('/updateuser', isLoggedIn, async (req, res) => {
  res.render('updateuser', { title: 'Update User', user: req.user });
});

router.post('/updateuser', isLoggedIn, async (req, res, next) => {
  try {
    await userSchema.findByIdAndUpdate(req.user._id, req.body);
    res.redirect('/user/profile');
  } catch (error) {
    next(error);
  }
});
// delete user

router.get('/deleteuser', isLoggedIn, async (req, res, next) => {
  try {
    const user = await userSchema.findByIdAndDelete(req.user._id);

    if (user.image != 'default.jpeg') {
      fs.unlinkSync(`public/images/${user.image}`);
    }
    res.redirect('/user/profile');
  } catch (error) {
    next(error);
  }
});

// change password

router.get('/passwordchange', isLoggedIn, async (req, res) => {
  res.render('passwordchange', { title: 'password change', user: req.user });
});

router.post('/passwordchange', isLoggedIn, async (req, res, next) => {
  try {
    req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    req.user.save();
    res.redirect('/user/profile');
  } catch (error) {
    next(error);
  }
});

// image
router.post(
  '/upload',
  isLoggedIn,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.user.image != 'default.jpeg') {
        fs.unlinkSync(`public/images/${req.user.image}`);
      }
      req.user.image = req.file.filename;
      await req.user.save();
      res.redirect('/user/profile');
    } catch (error) {
      next(error);
    }
  }
);

// forget password routes

// step 1

router.get('/forget-password', (req, res) => {
  res.render('forgetpassword_email', { title: 'Email', user: req.user });
});

router.post('/forget-password', async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) return next(new Error('User not found!'));

    // send email to user with otp
    // and save the same otp to database

    res.redirect(`/user/forget-password/${user._id}`);
  } catch (error) {
    next(error);
  }
});
// step 2

router.get('/forget-password/:id', (req, res) => {
  res.render('forgetpassword_otp', {
    title: 'Otp',
    user: req.user,
    id: req.params.id,
  });
});

router.post('/forget-password/:id', async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);
    /////////////

    res.redirect(`/user/set-password/${user._id}`);
  } catch (error) {
    next(error);
  }
});

// step 3
router.get('/set-password/:id', (req, res) => {
  res.render('forget-password_password', {
    title: 'Set Password',
    user: req.user,
    id: req.params.id,
  });
});

router.post('/set-password/:id', async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);
    await user.setPassword(req.body.password);
    await user.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});
module.exports = router;
