import Joi from "joi";
import {
  drippingPropsSchema,
  irrigationSystemPropsSchema,
  irrigationTypesNames,
  microSprinklingPropsSchema,
  pivotPropsSchema,
  plantingDateSchema,
  sprinklingPropsSchema,
  sulcosPropsSchema,
} from "./blade-suggestion";
import {
  idSchema,
  userAccountSchema,
} from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

const userIrrigationToPersist = Joi.object({
  CropId: Joi.number().integer().required(),
  Name: Joi.string().required(),
  PlantingDate: plantingDateSchema,
  IrrigationEfficiency: Joi.number().greater(0).optional(),
  System: irrigationSystemPropsSchema,
});

export const createUserIrrigationValidator = new SchemaValidator(
  userIrrigationToPersist.append({
    ...userAccountSchema,
  })
);

export const updateUserIrrigationValidator = new SchemaValidator(
  userIrrigationToPersist.append({
    ...idSchema,
    ...userAccountSchema,
  })
);

export const deleteUserIrrigationValidator = new SchemaValidator(
  Joi.object({
    ...idSchema,
    ...userAccountSchema,
  })
);

export const getUserIrrigationCropsByIdValidator = new SchemaValidator(
  Joi.object({
    ...idSchema,
    ...userAccountSchema,
  })
);

export const calculateUserIrrigationRecommendationByIdValidator =
  new SchemaValidator(
    Joi.object({
      ...idSchema,
      ...userAccountSchema,
    })
  );

export const getAllUserRecommendationsValidator = new SchemaValidator(
  Joi.object({
    ...userAccountSchema,
  })
);
