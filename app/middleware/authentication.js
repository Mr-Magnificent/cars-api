const jwt = require('jsonwebtoken');
const debug = require('debug')('app:');

const User = require('../models/User');

const authenticate = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: 'Token not present' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        debug.extend('auth')(decoded);
        const user = await User.findById(decoded);

        // eslint-disable-next-line require-atomic-updates
        req.user = user;

        next();
    } catch (err) {
        res.status(401).send({ message: err.message });
    }
};

module.exports = authenticate;
