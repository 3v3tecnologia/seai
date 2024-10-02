import Joi from "joi";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

export const loginValidator = new SchemaValidator(
  Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().valid("government", "irrigant").optional(),
  })
);
