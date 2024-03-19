const Joi = require("joi");

const validateNewUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(user);
};

const validateLoginUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};

const validateUpdateUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30),
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
  });

  return schema.validate(user);
};

module.exports = { validateNewUser, validateLoginUser, validateUpdateUser };
