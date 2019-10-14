const debug = require('debug')('app:bookings');
const moment = require('moment');

const Booking = require('../models/Bookings');
const Car = require('../models/Car');

exports.create = async (req, res) => {
    try {
        const issueDate = moment(req.body.issueDate, 'DD-MM-YYYY').startOf('day');
        const returnDate = moment(req.body.returnDate, 'DD-MM-YYYY').endOf('day');

        const dateIsValid = issueDate.isValid() && returnDate.isValid()
            && issueDate.isSameOrBefore(returnDate) && issueDate.isSameOrAfter(moment().startOf('day'));

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

        const result = await bookingExists(issueDate, returnDate, carBooked);
        if (result) {
            return res.status(422).json({ message: 'Car already booked for given dates' });
        }

        const createdBooking = await Booking.create({
            car_id: carBooked._id,
            user_details: req.user.id,
            issue_date: issueDate.toISOString(),
            return_date: returnDate.toISOString()
        });

        carBooked.bookings.push(createdBooking._id);
        await carBooked.save();

        return res.status(200).json({
            message: 'Booking Created',
            booking: createdBooking
        });

    } catch (err) {
        debug(err);
        return res.status(500).json({ message: err.message });
    }
};

const bookingExists = async (issueDate, returnDate, carBooked) => {
    try {
        let overlapQuery = Booking.findOne();
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
    
        overlapQuery.where({
            car_id: carBooked.id
        });

        const overlapBookings = await overlapQuery.exec();
        debug(overlapBookings);

        if (overlapBookings) {
            return true;
        }
        return false;
        
    } catch (err) {
        debug(err);
        throw err;
    }
};