const router = require('express').Router();
// const router = require('express')();
const Schemas = require('../app/config/validationSchemas');
const joiValidate = require('../app/middleware/validations');
const authenticate = require('../app/middleware/authentication');
const isAdminUser = require('../app/middleware/checkAdmin');

const LoginController = require('../app/controllers/login');
const CarController = require('../app/controllers/Car');
const BookingController = require('../app/controllers/Bookings');

router.post('/register', joiValidate(Schemas.register), LoginController.register);
router.post('/login', joiValidate(Schemas.login), LoginController.login);

router.use(authenticate);

// bookings
router.post('/create-booking', BookingController.create);

// Only admin users have car adding, deleting, updating authority
router.use(isAdminUser);
// cars
router.post('/create-car', CarController.create);
router.put('/update-car', CarController.update);
router.delete('/delete-car', CarController.delete);

module.exports = router;