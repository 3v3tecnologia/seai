import Joi from "joi";
import { paginationSchema } from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

export const fetchUserOperationsValidator = new SchemaValidator(
  Joi.object({
    user_id: Joi.number().optional(),
    resource: Joi.string().optional(),
    operation: Joi.string().optional(),
  }).append(paginationSchema)
);
