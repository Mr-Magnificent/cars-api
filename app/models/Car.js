const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    vehicle_num: { type: Number, required: true, index: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    model: { type: String, required: true, index: true },
    seat_capacity: Number,
    rent_per_day: Number
});

module.exports = mongoose.model('Car', carSchema);
