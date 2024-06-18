import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import { idSchema, paginationSchema } from "../../../utils/schemas";

const newsletterSchema = Joi.object({
    FK_Author: Joi.number().required(),
    Title: Joi.string().required(),
    Description: Joi.string().allow(null),
    Data: Joi.any(),
    SendDate: Joi.string().required(),
    LocationName: Joi.string().optional()
})

const createNews = new SchemaValidator(newsletterSchema)

const updateNews = new SchemaValidator(newsletterSchema.append(idSchema))

const deleteNews = new SchemaValidator(Joi.object(idSchema))

const fetchNewsById = new SchemaValidator(Joi.object(idSchema))

const fetchNews = new SchemaValidator(Joi.object({
    ...paginationSchema,
    title: Joi.string().optional()
}))

const updateSendAt = new SchemaValidator(Joi.object(idSchema))

const fetchOnlySent = new SchemaValidator(Joi.object({
    ...paginationSchema,
    title: Joi.string().optional()
}))


export default {
    createNews,
    updateNews,
    deleteNews,
    fetchNewsById,
    fetchNews,
    fetchOnlySent,
    updateSendAt
}