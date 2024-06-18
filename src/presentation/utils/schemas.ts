import Joi from "joi";

export const paginationSchema = {
    pageNumber: Joi.number().optional(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional(),
}

export const idSchema = {
    id: Joi.number().greater(0).required()
}