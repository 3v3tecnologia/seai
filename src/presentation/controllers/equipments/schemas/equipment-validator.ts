import Joi from "joi";
import { SchemaValidator } from "../../../../shared/validation/validator";
import {
  idSchema,
  UserOperationDescriptionSchema,
} from "../../../utils/schemas";

const updateEquipment = new SchemaValidator(
  Joi.object({
    Enable: Joi.boolean().required(),
  })
    .append(idSchema)
    .append(UserOperationDescriptionSchema)
);

export { updateEquipment };
