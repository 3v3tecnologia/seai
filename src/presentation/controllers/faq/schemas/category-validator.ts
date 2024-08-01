import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import {
  idSchema,
  userAccountSchema,
  UserOperationDescriptionSchema,
} from "../../../utils/schemas";

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
