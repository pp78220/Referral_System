const Joi = require('@hapi/joi');

function register(user) {
    let schema = Joi.object({

            fullname:Joi.string().required(),
            email:Joi.string().required(),
            password : Joi.string().required(),
            referrer : Joi.string()
    })
    let result = schema.validate(user)
    // console.log(result);
    return result
}

function login(user) {
    let schema = Joi.object({
            email:Joi.string().required(),
            password : Joi.string().required(),
    })
    let result = schema.validate(user)
    // console.log(result);
    return result
}


module.exports.register = register
module.exports.login = login