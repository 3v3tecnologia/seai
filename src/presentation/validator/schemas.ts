import Joi from "joi";

export const paginationSchema = {
    pageNumber: Joi.number().required(),
    limit: Joi.number().required(),
    offset: Joi.number().required(),
}

export const idSchema = {
    id: Joi.number().greater(0).required()
}