const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, index: true, required: true },
    email: { type: String, index: true, required: true },
    password: String,
    is_admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
