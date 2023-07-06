import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { ForgotPasswordController } from "../../../../../presentation/controllers/user-controller/forgot-password.controller";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { EmailValidator } from "../../../../../shared/validation/validator/email";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeForgotPasswordUser } from "../../use-cases/user/forgot-password-factory";

export const makeForgotPasswordController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["email"].map((field) => new RequiredFieldValidator(field));

  validations.push(new EmailValidator());

  const validationComposite = new ValidatorComposite(validations);

  return makeLogControllerDecorator(
    new ForgotPasswordController(makeForgotPasswordUser(), validationComposite)
  );
};
