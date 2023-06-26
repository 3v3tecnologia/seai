import { Validator } from "../../../../shared/validation/ports/validator";
import { EmailValidator } from "../../../../shared/validation/validator/email";
import { RequiredFieldValidator } from "../../../../shared/validation/validator/required-field";

export const makeCreateUserValidation = (): any => {
  let validations: Array<Validator> = [];

  const params = ["email", "types", "modules"];

  validations = params.map((param) => new RequiredFieldValidator(param));

  validations.push(new EmailValidator());

  //TODO: add types and modules validations
  return;
};
