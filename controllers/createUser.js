const bcrypt = require('bcryptjs');
const check = require('validator');
const User = require('../models/user');

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (check.isEmpty(password, { ignore_whitespace: true })) {
    return res.status(400).send({ message: 'Пароль не может состоять из пробелов' });
  }

  if (!check.isLength(password, { min: 6 })) {
    return res.status(400).send({ message: 'Минимальная длина пароля - 6 символов' });
  }

  if (!check.isEmail(email)) {
    return res.status(400).send({ message: 'E-mail is not a valid!' });
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      if (err.code === '11000') {
        return res.status(409).send({ message: err.message });
      }
      return res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports = { createUser };
