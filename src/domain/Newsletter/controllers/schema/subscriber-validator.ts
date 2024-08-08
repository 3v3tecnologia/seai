import Joi from "joi";
import { paginationSchema } from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

const subscribe = new SchemaValidator(
  Joi.object({
    Email: Joi.string().required(),
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
    ...paginationSchema,
  })
);

export default {
  subscribe,
  unsubscribe,
  fetchNews,
};
