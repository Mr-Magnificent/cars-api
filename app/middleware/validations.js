const Joi = require('@hapi/joi');
const debug = require('debug')('app:');

const validations = (schema, property) => { 
    return (req, res, next) => { 
        const { error } = Joi.validate(req.body, schema); 
        const valid = error == null; 
  
        if (valid) { 
            next(); 
        } else { 
            const { details } = error; 
            const message = details.map(i => i.message).join(',');
  
            debug.extend('validation error')(message); 
            res.status(422).json({ error: message }); } 
    }; 
}; 

module.exports = validations;