import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import {
  idSchema,
  paginationSchema,
} from "../../../../presentation/utils/schemas";

const newsletterSchema = Joi.object({
  Title: Joi.string().required(),
  Description: Joi.string().allow(null),
  Data: Joi.any(),
  SendDate: Joi.string().required(),
  LocationName: Joi.string().optional(),
});

const createNews = new SchemaValidator(newsletterSchema);

const updateNews = new SchemaValidator(newsletterSchema.append(idSchema));

const deleteNews = new SchemaValidator(Joi.object(idSchema));

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

const updateSendAt = new SchemaValidator(Joi.object(idSchema));

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
