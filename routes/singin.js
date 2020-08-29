const singinRouter = require('express').Router();
const { login } = require('../controllers/login');

singinRouter.post('/', login);

module.exports = singinRouter;
