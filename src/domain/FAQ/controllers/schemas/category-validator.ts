import Joi from "joi";
import {
  idSchema,
  userAccountSchema,
  UserOperationDescriptionSchema,
} from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

export const createFaqCategoryValidator = new SchemaValidator(
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  }).append(userAccountSchema)
);

export const updateFaqCategoryValidator = new SchemaValidator(
  Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  })
    .append(idSchema)
    .append(UserOperationDescriptionSchema)
);

export const deleteFaqCategoryValidator = new SchemaValidator(
  Joi.object(idSchema).append(UserOperationDescriptionSchema)
);
