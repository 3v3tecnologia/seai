import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import { paginationSchema } from "../../../../presentation/utils/schemas";

export const fetchUserOperationsValidator = new SchemaValidator(
  Joi.object({
    user_id: Joi.number().optional(),
    resource: Joi.string().optional(),
    operation: Joi.string().optional(),
  }).append(paginationSchema)
);
