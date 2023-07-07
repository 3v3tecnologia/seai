import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { ResetPasswordController } from "../../../../../presentation/controllers/user-controller/reset-password.controller";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeRegisterUserLogs } from "../../use-cases/use_case_logs";
import { makeResetUserPassword } from "../../use-cases/user/reset-user-password-factory";

export const makeResetUserController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["token", "password"].map(
    (field) => new RequiredFieldValidator(field)
  );

  const validationComposite = new ValidatorComposite(validations);
  return makeLogControllerDecorator(
    new ResetPasswordController(
      makeResetUserPassword(),
      validationComposite,
      makeRegisterUserLogs()
    )
  );
};
