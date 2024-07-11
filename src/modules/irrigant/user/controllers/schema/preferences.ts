import Joi from "joi";

import { userAccountSchema } from "../../../../../presentation/utils/schemas";
import { SchemaValidator } from "../../../../../shared/validation/validator";

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
    StationId: Joi.number().required(),
    PluviometerId: Joi.number().required(),
  })
);

export const getNotificationsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
  })
);
