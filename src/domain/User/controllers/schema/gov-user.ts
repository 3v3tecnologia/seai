import Joi from "joi";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";
import { Modules } from "../../core/model/user-modules-access";
import { idSchema, paginationSchema, userAccountSchema, UserOperationDescriptionSchema } from "../../../../shared/infra/validator/schemas";


const systemModulesPermissionsSchema = Joi.object({
  id: Joi.number(),
  read: Joi.boolean().required(),
  write: Joi.boolean().required(),
}).required();

const userModulesAccess = Joi.object({
  [Modules.USER]: systemModulesPermissionsSchema,
  [Modules.EQUIPMENTS]: systemModulesPermissionsSchema,
  [Modules.CROP]: systemModulesPermissionsSchema,
  [Modules.FAQ]: systemModulesPermissionsSchema,
  [Modules.NEWSLETTER]: systemModulesPermissionsSchema,
  [Modules.STUDIES]: systemModulesPermissionsSchema,
  [Modules.WEIGHTS]: systemModulesPermissionsSchema,
  [Modules.BUSINESS_ANALYSIS]: systemModulesPermissionsSchema,
  [Modules.LOGS]: Joi.object({
    id: Joi.number(),
    read: Joi.boolean().required(),
    write: Joi.boolean().required(),
  }).optional(),
});

export const userTypes = Joi.string().valid("admin", "standard");



export const createGovUserValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().required(),
    type: userTypes.required(),
    modules: userModulesAccess.required(),
  }).append(userAccountSchema)
);

export const updateGovUserValidator = new SchemaValidator(
  Joi.object({
    ...idSchema,
    type: userTypes.required(),
    email: Joi.string().email().required(),
    modules: userModulesAccess.optional(),
    name: Joi.string().required(),
    login: Joi.string().required(),
  }).append(UserOperationDescriptionSchema)
);

export const completeGovUserRegistrationValidator = new SchemaValidator(
  Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  })
);

export const deleteGovUserValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().optional(),
  })
    .append(UserOperationDescriptionSchema)
    .append(idSchema)
);

export const fetchAllGovUsersValidator = new SchemaValidator(
  Joi.object({
    ...paginationSchema,
    name: Joi.string().optional(),
    type: userTypes.optional(),
  })
);

export const fetchGovUserByIdValidator = new SchemaValidator(
  Joi.object({
    accountId: Joi.number().integer().optional(),
    id: Joi.number().integer().optional(),
  })
);

export const fetchGovUserValidator = new SchemaValidator(
  Joi.object({
    id: Joi.number().greater(0).optional(),
    accountId: Joi.number().integer().greater(0).optional(),
    name: Joi.string().optional(),
    type: userTypes.optional(),
    ...paginationSchema,
  })
);

export const forgotGovPasswordValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

export const resetGovPasswordValidator = new SchemaValidator(
  Joi.object({
    code: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  })
);

export const signInValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().optional(),
    login: Joi.string().optional(),
    password: Joi.string().required(),
  })
);

export const signUpValidator = new SchemaValidator(
  Joi.object({
    name: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }).append(userAccountSchema)
);

export const updateProfilerValidator = new SchemaValidator(
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    login: Joi.string().required(),
  }).append(userAccountSchema)
);
