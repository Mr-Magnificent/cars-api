const router = require('express').Router();
// const router = require('express')();
const Schemas = require('../app/config/validationSchemas');
const joiValidate = require('../middleware/validations');


const LoginController = require('../app/controllers/login');

router.post('/register', joiValidate(Schemas.register), LoginController.register);
router.post('/login', joiValidate(Schemas.login), LoginController.login);

module.exports = router;