import Joi from "joi";

export const paginationSchema = {
  pageNumber: Joi.number().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
};

export const idSchema = {
  id: Joi.number().greater(0).required(),
};

export const userAccountSchema = {
  accountId: Joi.number().integer().required(),
};

export const UserOperationDescriptionSchema = {
  Operation: Joi.string().min(6).required(),
  ...userAccountSchema,
};
