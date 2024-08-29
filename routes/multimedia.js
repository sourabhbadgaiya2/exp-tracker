const express = require('express');
const router = express.Router();
const media = require('../models/mediaSchema');
const upload = require('../utils/multer');



router.get('/multimedia', (req, res) => {
  res.render('multimedia');
});

router.post('/multimedia', upload.single('image'), async (req, res) => {
  try {
    const newmedia = new media({
      ...req.body,
      image: req.file.filename,
    });
    await newmedia.save();
    res.redirect('/');
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
