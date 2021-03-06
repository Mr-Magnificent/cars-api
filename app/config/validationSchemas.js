const Joi = require('@hapi/joi');

const schemas = {
    register: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required().note('Password should be atleast 6 letters'),
        isAdmin: Joi.boolean().default(false)
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required().note('Password should be atleast 6 letters')
    }),
    addCar: Joi.object({
        vin: Joi.string().required().description('Vehicle registration number'),
        city: Joi.string().required().description('City of car'),
        model: Joi.string().required(),
        seatCapacity: Joi.number(),
        rentPerDay: Joi.number(),
    })
};

module.exports = schemas;