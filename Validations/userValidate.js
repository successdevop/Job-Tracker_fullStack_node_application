const Joi = require("joi");

const validateNewUser = (user) => {
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30).required(),
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,16}$"))
      .required(),
    confirmPassword: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,16}$"))
      .required(),
    email: Joi.string().email().required(),
  });

  return schema.validate(user);
};

const validateLoginUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,16}$"))
      .required(),
  });

  return schema.validate(user);
};

module.exports = { validateNewUser, validateLoginUser };
