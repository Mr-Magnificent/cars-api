const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const express = require('express');
const debug = require('debug')('app:');

const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User doesn\'t exist' });
        }

        const pwdEqual = await bcrypt.compare(req.body.password, user.password);
        if (!pwdEqual) {
            return res.status(401).json({ message: 'password mismatch' });
        }

        const token = jwt.sign({ ...user._id }, process.env.SECRET);
        res.cookie('jwt', token, {httpOnly: true});
        return res.json({ message: 'Successfully logged in', token: token });

    } catch (err) {
        debug.extend('error login')(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        debug.extend('user')(userExists);
        if (userExists) {
            return res.status(400).json({ message: 'User already registered' });
        }

        const hashedPwd = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));

        const userCreated = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPwd,
            is_admin: req.body.is_admin
        });

        return res.status(200).json({
            message: 'User Created',
            user: userCreated
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};