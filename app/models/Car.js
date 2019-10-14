const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    vin: { type: String, required: true, index: true, unique: true  },
    city: { type: String, required: true, lowercase: true },
    model: { type: String, required: true, index: true, lowercase: true },
    seat_capacity: Number,
    rent_per_day: Number,
    bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});

module.exports = mongoose.model('Car', carSchema);
