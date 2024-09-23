import Joi from "joi";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";
import { idSchema, userAccountSchema } from "../../../../shared/infra/validator/schemas";

export const saveEquipmentsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
    StationId: Joi.number().required(),
    PluviometerId: Joi.number().required(),
  })
);

export const updateEquipmentsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
    StationId: Joi.number().required(),
    PluviometerId: Joi.number().required(),
  })
);

export const deleteEquipmentsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
  })
);

export const getEquipmentsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
  })
);

export const updateNotificationsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
    ...idSchema,
    Enabled: Joi.boolean().required(),
  })
);

export const getNotificationsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
  })
);
