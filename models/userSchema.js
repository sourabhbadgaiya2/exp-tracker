const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' Username is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, ' Username is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: String,
    image: {
      type: String,
      default: 'default.jpeg',
    },
  },
  { timestamps: true }
);
userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);
