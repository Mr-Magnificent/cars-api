const debug = require('debug')('app:bookings');
const moment = require('moment');

const Booking = require('../models/Bookings');
const Car = require('../models/Car');

exports.create = async (req, res) => {

    try {
        const issueDate = moment(req.body.issueDate, 'DD-MM-YYYY');
        const returnDate = moment(req.body.returnDate, 'DD-MM-YYYY');

        const dateIsValid = issueDate.isValid() && returnDate.isValid()
            && issueDate.isSameOrBefore(returnDate);

        if (!dateIsValid) {
            return res.status(422).json({
                message: 'issueDate or returnDate invalid'
            });
        }

        const carBooked = await Car.findOne({ vin: req.body.vin });
        if (!carBooked) {
            return res.status(404).json({
                message: 'Car not found for given VIN'
            });
        }

        const createdBooking = await Booking.create({
            car_id: carBooked._id,
            user_details: req.user.id,
            issue_date: issueDate.toISOString(),
            return_date: returnDate.toISOString()
        });

        carBooked.bookings.push(createdBooking._id);

        return res.status(200).json({
            message: 'Booking Created',
            booking: createdBooking
        });

    } catch (err) {
        debug(err);
        return res.status(500).json({ message: err.message });
    }
};