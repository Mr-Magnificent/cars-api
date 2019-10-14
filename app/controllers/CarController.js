const debug = require('debug')('app:car');
const moment = require('moment');
const Car = require('../models/Car');
const Booking = require('../models/Bookings');

exports.create = async (req, res) => {
    try {
        const carCreated = await Car.create({
            vin: req.body.vin,
            city: req.body.city,
            model: req.body.model,
            seat_capacity: req.body.seatCapacity,
            rent_per_day: req.body.rentPerDay
        });
        return res.status(200).json({
            message: 'Car has been added',
            car: carCreated
        });
    } catch (err) {
        debug.extend('error create')(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    if (!req.body.vin) {
        return res.status(400).json({ message: 'vehicle identification number (VIN) required' });
    }

    try {
        const car = await Car.findOne({ vin: req.body.vin });
        
        if (!car) {
            return res.status(404).json({
                message: 'No such car'
            });
        }
        
        const active = await chkActiveBookings(car.id);
        if (active) {
            return res.status(422).send({message: 'The car cannot be modified because of active bookings'});
        }
        
        const updateQuery = Car.find({ vin: req.body.vin });
        if (req.body.city) {
            updateQuery.update({
                city: req.body.city
            });
        }

        if (req.body.seatCapacity) {
            updateQuery.update({
                seat_capacity: parseInt(req.body.seatCapacity)
            });
        }

        if (req.body.rentPerDay) {
            updateQuery.update({
                rent_per_day: parseInt(req.body.rentPerDay)
            });
        }

        if (req.body.model) {
            updateQuery.update({
                model: req.body.model
            });
        }

        const updatedCar = await updateQuery.exec();

        return res.status(200).json({
            message: 'Car updated',
            updated: updatedCar
        });

    } catch (err) {
        debug.extend('error update')(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    if (!req.query.vin) {
        return res.status(400).json({ message: 'vehicle identification number (VIN) required' });
    }

    try {
        const car = await Car.findOne({
            vin: req.query.vin
        });

        if (!car) {
            return res.status(404).json({
                message: 'No such car'
            });
        }

        const active = await chkActiveBookings(car.id);
        if (active) {
            return res.status(422).send({message: 'The car cannot be deleted because of active bookings'});
        }

        const deletedCar = await Car.findByIdAndDelete(car.id);
        const deletedBookings = await Booking.deleteMany({
            car_id: deletedCar.id
        });
        
        return res.status(200).json({
            message: 'Car removed',
            car: deletedCar,
            bookings: {
                message: 'deleted associated bookings with car',
                deleted: deletedBookings
            }
        });

    } catch (err) {
        debug.extend('error delete')(err);
        return res.status(500).json({ message: err.message });
    }
};

const chkActiveBookings = async (id) => {
    try {
        const bookings = await Booking.findOne({
            car_id: id,
            return_date: {
                $gte: moment().startOf('day').toISOString()
            }
        });

        if (bookings) {
            return true;
        }
        return false;

    } catch (err) {
        debug.extend('chkActiveBookings')(err);
        throw err;
    }
};

exports.search = async (req, res) => {
    try {
        const overlapDocs = await getOverlapDocuments(req);
        const overlapDocsId = overlapDocs.map((doc) => (doc.car_id.toJSON()));

        debug.extend('overlapDocsId')(JSON.stringify(overlapDocsId));

        const cars = await Car.find({
            _id: { $nin: overlapDocsId }
        });

        debug.extend('cars')(cars);

        return res.status(200).json({cars: cars});
    } catch (err) {
        debug(err);
        if (err.name === 'validationError') {
            return res.status(422).json({message: err.message});
        }
        return res.status(500).json({ message: err.message });
    }
};

const getOverlapDocuments = async (req) => {
    const issueDate = moment(req.query.issueDate, 'DD-MM-YYYY').startOf('day');
    const returnDate = moment(req.query.returnDate, 'DD-MM-YYYY').endOf('day');

    const datesValid = issueDate.isValid() && returnDate.isValid()
    && issueDate.isSameOrBefore(returnDate);

    if (!datesValid) {
        let validationError = new Error('issueDate or returnDate invalid');
        validationError.name = 'validationError';
        throw validationError;
    }

    try {
        let overlapQuery = Booking.find();

        if (req.query.city) {
            overlapQuery.where({
                city: req.query.city
            });
        }
        
        /**
         *     isu [ ret ],  [ isu ] ret, [ isu ret ]
         */
        overlapQuery.where({
            $or: [
                {
                    issue_date: {
                        $gte: issueDate.toISOString(),
                        $lte: returnDate.toISOString()
                    }
                },
                {
                    return_date: {
                        $gte: issueDate.toISOString(),
                        $lte: returnDate.toISOString()
                    }
                }
            ]
        });

        const overlapBookings = overlapQuery.exec();
        debug.extend('bookings')(JSON.stringify(overlapBookings));

        return overlapBookings;
    } catch (err) {
        debug(err);
        throw err;
    }
};

exports.searchByModel = async (req, res) => {
    if (!req.query.model) {
        return res.status(400).json({ message: 'Model not provided' });
    }
    try {
        const cars = await Car.find({
            model: req.query.model
        }).populate('bookings');
        
        return res.json({
            cars: cars
        });
    } catch (err) {
        debug.extend('searchByModel')(err);
        res.status(500).json({
            message: err.message
        });
    }
};
