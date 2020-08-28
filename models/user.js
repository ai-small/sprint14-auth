const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link, { protocols: ['http', 'https'], require_protocol: true });
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email, { allow_utf8_local_part: false });
      },
      message: (props) => `${props.value} is not a valid e-mail!`,
    },
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('user', userSchema);
