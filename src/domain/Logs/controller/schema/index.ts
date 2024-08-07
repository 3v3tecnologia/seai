import Joi from "joi";
import { paginationSchema } from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

export const fetchUserOperationsValidator = new SchemaValidator(
  Joi.object({
    user_id: Joi.number().optional(),
    resource: Joi.string().optional(),
    operation: Joi.string().optional(),
    start_date: Joi.when("end_date", {
      is: Joi.exist(),
      then: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
        .required(),
    }),
    end_date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
      .optional(),
  }).append(paginationSchema)
);
