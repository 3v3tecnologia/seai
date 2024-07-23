import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import { paginationSchema } from "../../../../presentation/utils/schemas";

const subscribe = new SchemaValidator(
  Joi.object({
    Email: Joi.string().required(),
    Name: Joi.string().required(),
  })
);

const unsubscribe = new SchemaValidator(
  Joi.object({
    email: Joi.string().required(),
  })
);

const fetchNews = new SchemaValidator(
  Joi.object({
    email: Joi.string().optional(),
    name: Joi.string().optional(),
    ...paginationSchema,
  })
);

export default {
  subscribe,
  unsubscribe,
  fetchNews,
};
