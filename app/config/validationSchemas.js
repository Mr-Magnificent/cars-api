const joi = require('@hapi/joi');

const schemas = {
    register: {
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required().note('Password should be atleast 6 letters')
    },
    login: {
        email: joi.string().email().required(),
        password: joi.string().min(6).required().note('Password should be atleast 6 letters')
    }
};

module.exports = schemas;