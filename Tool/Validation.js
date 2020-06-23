
const Joi=require('@hapi/joi');

const validate_login=Joi.object({
    email:Joi.string().email().min(5).max(50).required(),
    pwd:Joi.string().min(6).required()
});

const validate_user=Joi.object({
    name:Joi.string().min(5).max(50).required(),
    email:Joi.string().email().min(5).max(50).required(),
    pwd:Joi.string().min(6).required()
});

const validate_student=Joi.object({
    first_name: Joi.string().min(5).max(50).required(),
    last_name: Joi.string().min(5).max(50).required(),
    gender:Joi.string().min(5).max(10).required(),
    age: Joi.number().integer().required(),
    class: Joi.string().min(5).max(10).required(),
    From: Joi.string().min(5).max(10).required(),
});

module.exports.validate_user=validate_user;
module.exports.validate_student=validate_student;
module.exports.validate_login=validate_login;