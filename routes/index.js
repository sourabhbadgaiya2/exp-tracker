var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Homepage', user: req.user });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About page', user: req.user });
});

module.exports = router;
