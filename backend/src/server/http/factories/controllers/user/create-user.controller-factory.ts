import { Validator } from "../../../../../shared/validation/ports/validator";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { CreateUserController } from "../../../../../presentation/controllers/user-controller/create-user.controller";
import { EmailValidator } from "../../../../../shared/validation/validator/email";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { makeCreateUser } from "../../use-cases/user/create-user-usecase-factory";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterUserLogs } from "../../use-cases/logs";

export const makeCreateUserController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["email", "type", "modules"].map(
    (field) => new RequiredFieldValidator(field)
  );

  validations.push(new EmailValidator());

  const validationComposite = new ValidatorComposite(validations);

  return makeLogControllerDecorator(
    new CreateUserController(
      makeCreateUser(),
      validationComposite,
      makeRegisterUserLogs()
    )
  );
};
