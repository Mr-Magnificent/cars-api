const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citiesSchema = new Schema({
    city_name: String,
    cars: Number
});

module.exports = mongoose.model('City', citiesSchema);
