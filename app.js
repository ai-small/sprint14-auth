const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const singUpRouter = require('./routes/singup');
const singInRouter = require('./routes/singin');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const notFound = require('./routes/notFound');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '5f2fe87a9db70f0f6fa0cbef' };
  next();
});

app.use('/signin', singInRouter);
app.use('/signup', singUpRouter);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(notFound);

app.listen(PORT, () => {

});
