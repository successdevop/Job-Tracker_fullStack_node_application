const Joi = require("joi");

const validateCreateJob = (user) => {
  const schema = Joi.object({
    company: Joi.string().min(3).max(50).required(),
    companyInfo: Joi.string().min(3).max(50).required(),
    jobTitle: Joi.string().min(3).max(50).required(),
    jobStatus: Joi.string().min(3).max(50),
    createdBy: Joi.object().id(),
  });

  return schema.validate(user);
};

module.exports = { validateCreateJob };
