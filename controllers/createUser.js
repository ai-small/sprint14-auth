const bcrypt = require('bcryptjs');
const User = require('../models/user');

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (password.length < 6) {
    res.status(400).send({ message: 'password is not a valid!' });
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message.includes('E11000')) {
        res.status(400).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else res.status(500).send({ message: `На сервере произошла ошибка: ${err.message}` });
    });
};

module.exports = { createUser };
