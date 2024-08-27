import Joi from "joi";
import {
  idSchema,
  userAccountSchema,
  UserOperationDescriptionSchema,
} from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

export const createFaqValidator = new SchemaValidator(
  Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    id_category: Joi.number().greater(0).required(),
  }).append(userAccountSchema)
);

export const updateFaqValidator = new SchemaValidator(
  Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    id_category: Joi.number().greater(0).required(),
  })
    .append(idSchema)
    .append(UserOperationDescriptionSchema)
);

export const deleteFaqValidator = new SchemaValidator(
  Joi.object(idSchema).append(UserOperationDescriptionSchema)
);
