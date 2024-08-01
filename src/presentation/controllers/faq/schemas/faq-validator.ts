import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import {
  idSchema,
  userAccountSchema,
  UserOperationDescriptionSchema,
} from "../../../utils/schemas";

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
