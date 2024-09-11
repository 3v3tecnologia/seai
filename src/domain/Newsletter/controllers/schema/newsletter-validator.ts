import Joi from "joi";
import {
  idSchema,
  paginationSchema,
  userAccountSchema,
  UserOperationDescriptionSchema,
} from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

const newsletterSchema = Joi.object({
  Title: Joi.string().required(),
  Description: Joi.string().allow(null),
  Data: Joi.any(),
  SendDate: Joi.string().required(),
  // LocationName: Joi.string().optional(),
});

const createNews = new SchemaValidator(
  newsletterSchema.append(userAccountSchema)
);

const updateNews = new SchemaValidator(
  newsletterSchema.append(idSchema).append(UserOperationDescriptionSchema)
);

const deleteNews = new SchemaValidator(
  Joi.object(idSchema).append(UserOperationDescriptionSchema)
);

const fetchNewsById = new SchemaValidator(Joi.object(idSchema));

const fetchNewsletterFilter = {
  title: Joi.string().optional(),
  sendDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")
    .optional(),
};

const fetchNews = new SchemaValidator(
  Joi.object({
    ...paginationSchema,
    ...fetchNewsletterFilter,
  })
);

const updateSendAt = new SchemaValidator(Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD").required()
}));

const fetchOnlySent = new SchemaValidator(
  Joi.object({
    ...paginationSchema,
    ...fetchNewsletterFilter,
  })
);

export default {
  createNews,
  updateNews,
  deleteNews,
  fetchNewsById,
  fetchNews,
  fetchOnlySent,
  updateSendAt,
};
