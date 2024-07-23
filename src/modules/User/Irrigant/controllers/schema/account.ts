import Joi from "joi";

import { SchemaValidator } from "../../../../../shared/validation/validator";

export const loginValidator = new SchemaValidator(
  Joi.object({
    login: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().required(),
  })
);

export const createUserValidator = new SchemaValidator(
  Joi.object({
    login: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  })
);
