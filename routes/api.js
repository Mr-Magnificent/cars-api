const router = require('express').Router();
// const router = require('express')();
const Schemas = require('../app/config/validationSchemas');

// middleware
const joiValidate = require('../app/middleware/validations');
const authenticate = require('../app/middleware/authentication');
const isAdminUser = require('../app/middleware/checkAdmin');

// controllers
const LoginController = require('../app/controllers/loginController');
const CarController = require('../app/controllers/CarController');
const BookingController = require('../app/controllers/BookingsController');

router.post('/register', joiValidate(Schemas.register), LoginController.register);
router.post('/login', joiValidate(Schemas.login), LoginController.login);

router.get('/search-cars', CarController.search);
router.get('/search-by-model', CarController.searchByModel);

// protected routes
router.use(authenticate);

// bookings
router.post('/create-booking', BookingController.create);

// Only admin users have car adding, deleting, updating authority
router.use(isAdminUser);
// cars
router.post('/add-car', joiValidate(Schemas.addCar), CarController.create);
router.put('/update-car', CarController.update);
router.delete('/delete-car', CarController.delete);

module.exports = router;