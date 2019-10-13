const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const express = require('express');
const debug = require('debug')('app:');

const Customer = require('../models/Customer');

exports.login = async (req, res) => {
    try {
        const user = await Customer.find({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User doesn\'t exist' });
        }

        const pwdEqual = await bcrypt.compare(req.body.password, user.password);

        if (!pwdEqual) {
            return res.status(401).json({ message: 'password mismatch' });
        }

        const token = jwt.sign(user._id, process.env.SECRET);
        
        res.cookie('jwt', token, {httpOnly: true});
        return res.json({ message: 'Successfully logged in', token: token });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const userExists = await Customer.find({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: 'User already registered' });
        }

        const hashedPwd = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

        const userCreated = await Customer.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPwd
        });

        return res.status(200).json({
            message: 'User Created',
            user: userCreated
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};