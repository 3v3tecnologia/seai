import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import {
  drippingPropsSchema,
  irrigationTypesNames,
  microSprinklingPropsSchema,
  pivotPropsSchema,
  sprinklingPropsSchema,
  sulcosPropsSchema,
} from "./blade-suggestion";
import {
  idSchema,
  userAccountSchema,
} from "../../../../presentation/utils/schemas";

const userIrrigationToPersist = Joi.object({
  CropId: Joi.number().integer().required(),
  Name: Joi.string().required(),
  PlantingDate: Joi.string()
    .pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/, "DD/MM/YYYY")
    .required(),
  IrrigationEfficiency: Joi.number().greater(0).optional(),
  System: Joi.object({
    Type: Joi.string()
      .valid(...irrigationTypesNames)
      .required(),
    Measurements: Joi.alternatives()
      .conditional("Type", {
        switch: [
          { is: "Sulcos", then: sulcosPropsSchema },
          { is: "Pivô Central", then: pivotPropsSchema },
          { is: "Gotejamento", then: drippingPropsSchema },
          { is: "Microaspersão", then: microSprinklingPropsSchema },
          { is: "Aspersão", then: sprinklingPropsSchema },
        ],
        otherwise: Joi.any().forbidden(),
      })
      .required(),
  }).required(),
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
