const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tempSchema = new Schema({
	test: String,
	int: Number,
	isTrue: Boolean
});

const Temp = mongoose.model('temp', tempSchema);
module.exports = Temp;
