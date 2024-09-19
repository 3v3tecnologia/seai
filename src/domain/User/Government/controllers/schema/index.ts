import Joi from "joi";
import {
  paginationSchema,
  UserOperationDescriptionSchema,
} from "../../../../../shared/infra/validator/schemas";

import {
  idSchema,
  userAccountSchema,
} from "../../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../../shared/infra/validator/validator";
import { Modules } from "../../model/user-modules-access";

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
  [Modules.LOGS]: Joi.object({
    id: Joi.number(),
    read: Joi.boolean().required(),
    write: Joi.boolean().required(),
  }).optional(),
});

export const userTypes = Joi.string().valid("admin", "standard");

export const loginValidator = new SchemaValidator(
  Joi.object({
    login: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().required(),
  })
);

export const createUserValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().required(),
    type: userTypes.required(),
    modules: userModulesAccess.required(),
  }).append(userAccountSchema)
);

export const updateUserValidator = new SchemaValidator(
  Joi.object({
    ...idSchema,
    type: userTypes.required(),
    email: Joi.string().email().required(),
    modules: userModulesAccess.optional(),
    name: Joi.string().required(),
    login: Joi.string().required(),
  }).append(UserOperationDescriptionSchema)
);

export const completeUserRegistrationValidator = new SchemaValidator(
  Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  })
);

export const deleteUserValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().optional(),
  })
    .append(UserOperationDescriptionSchema)
    .append(idSchema)
);

export const fetchAllUsersValidator = new SchemaValidator(
  Joi.object({
    ...paginationSchema,
    name: Joi.string().optional(),
    type: userTypes.optional(),
  })
);

export const fetchUserByIdValidator = new SchemaValidator(
  Joi.object({
    accountId: Joi.number().integer().optional(),
    id: Joi.number().integer().optional(),
  })
);

export const fetchUserValidator = new SchemaValidator(
  Joi.object({
    id: Joi.number().greater(0).optional(),
    accountId: Joi.number().integer().greater(0).optional(),
    name: Joi.string().optional(),
    type: userTypes.optional(),
    ...paginationSchema,
  })
);

export const forgotPasswordValidator = new SchemaValidator(
  Joi.object({
    email: Joi.string().email().required(),
  })
);

export const resetPasswordValidator = new SchemaValidator(
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
