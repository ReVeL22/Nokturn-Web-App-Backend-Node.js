const Joi = require('@hapi/joi')

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        login: Joi.string().min(3).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        city: Joi.string().min(3).required()
    })
    return schema.validate(data)
}

const postValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().min(4).required().email(),
        city: Joi.string().min(3).required(),
        instruments: Joi.array().items(Joi.boolean().required()),
        band: Joi.array().items(Joi.boolean().required()),
        about: Joi.string().min(3).required()
    })
    return schema.validate(data)
}

const tourValidation = data => {
    const schema = Joi.object({
        city: Joi.string().min(2).required(),
        eventDate: Joi.date().required()
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        login: Joi.string().min(3).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data)
}

const bandValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(1).required()
    })

    return schema.validate(data)
}

const inviteValidation = data => {
    const schema = Joi.object({
        endUserId: Joi.string().min(1).required(),
        name: Joi.string().min(1).required()
    })

    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.tourValidation = tourValidation
module.exports.bandValidation = bandValidation
module.exports.inviteValidation = inviteValidation