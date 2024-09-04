
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  const filetype = /jpeg|jpg|png|gif|svg|webp/;
  const extname = filetype.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetype.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    console.log('Image Only');
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
