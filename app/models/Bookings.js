const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    car_id: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    user_details: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issue_date: { type: Date, required: true, index: true },
    return_date: { type: Date, required: true, index: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
