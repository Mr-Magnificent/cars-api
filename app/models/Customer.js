const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    username: { type: String, index: true, required: true },
    email: { type: String, index: true, required: true },
    password: String
});

module.exports = mongoose.model('Customer', customerSchema);
