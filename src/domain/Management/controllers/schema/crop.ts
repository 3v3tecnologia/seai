import Joi from "joi";
import {
  idSchema,
  userAccountSchema,
  UserOperationDescriptionSchema,
} from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

// const createCropValidator = new SchemaValidator(
//   Joi.object({
//     Name: Joi.string().trim().required(),
//     IsPermanent: Joi.boolean().required(),
//     CycleRestartPoint: Joi.string().trim().optional(),
//     CreatedAt: Joi.string().isoDate().optional(),
//     UpdatedAt: Joi.string().isoDate().optional(),
//   }).append(userAccountSchema)
// );

const createCropValidator = new SchemaValidator(
  Joi.object({
    Name: Joi.string().trim().required(),
    IsPermanent: Joi.boolean().required(),
    CycleRestartPoint: Joi.string().trim().optional(),
    Cycles: Joi.array()
      .items(
        Joi.object({
          Title: Joi.string().trim().required(),
          Start: Joi.number().integer().required(),
          End: Joi.number().integer().required(),
          KC: Joi.number().required(),
          Increment: Joi.number().required(),
        })
      )
      .required(),
  }).append(userAccountSchema)
);

const updateCropValidator = new SchemaValidator(
  Joi.object({
    Name: Joi.string().required(),
    IsPermanent: Joi.boolean().required(),
    CycleRestartPoint: Joi.string().trim().optional(),
    Cycles: Joi.array()
      .items(
        Joi.object({
          Title: Joi.string().trim().required(),
          Start: Joi.number().integer().required(),
          End: Joi.number().integer().required(),
          KC: Joi.number().required(),
          Increment: Joi.number().required(),
        })
      )
      .required(),
  })
    .append(UserOperationDescriptionSchema)
    .append(idSchema)
);

// const updateCropValidator = new SchemaValidator(
//   Joi.object({
//     Name: Joi.string().required(),
//     IsPermanent: Joi.boolean().required(),
//     CycleRestartPoint: Joi.string().trim().optional(),
//   })
//     .append(UserOperationDescriptionSchema)
//     .append(idSchema)
// );

const deleteCropValidator = new SchemaValidator(
  Joi.object(idSchema).append(UserOperationDescriptionSchema)
);

const getCropByIdValidator = new SchemaValidator(
  Joi.object({
    id: Joi.number().required(),
  })
);

const getAllCropCropCyclesValidator = new SchemaValidator(
  Joi.object({
    id: Joi.number().required(),
  })
);

const createCropCycleValidator = new SchemaValidator(
  Joi.object({
    data: Joi.array()
      .items(
        Joi.object({
          Title: Joi.string().trim().required(),
          // DurationInDays: Joi.number().integer().required(),
          Start: Joi.number().integer().required(),
          End: Joi.number().integer().required(),
          KC: Joi.number().required(),
          Increment: Joi.number().required(),
        })
      )
      .required(),
  })
    .append(userAccountSchema)
    .append(idSchema)
);

const getAllCropsValidator = new SchemaValidator(
  Joi.object({
    name: Joi.string().strict(true).optional(),
  })
);

export {
  createCropValidator,
  updateCropValidator,
  deleteCropValidator,
  getCropByIdValidator,
  getAllCropCropCyclesValidator,
  createCropCycleValidator,
  getAllCropsValidator,
};
