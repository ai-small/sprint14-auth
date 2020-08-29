const singUpRouter = require('express').Router();
const { createUser } = require('../controllers/createUser');

singUpRouter.post('/', createUser);

module.exports = singUpRouter;
