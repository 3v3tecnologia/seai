import Joi from "joi";
import {
  idSchema,
  UserOperationDescriptionSchema,
} from "../../../../shared/infra/validator/schemas";
import { SchemaValidator } from "../../../../shared/infra/validator/validator";

const updateEquipment = new SchemaValidator(
  Joi.object({
    Enable: Joi.boolean().required(),
  })
    .append(idSchema)
    .append(UserOperationDescriptionSchema)
);

export { updateEquipment };
