import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { LoadUserAccessController } from "../../../../../presentation/controllers/user-controller/load-user-acess.controller";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeGetUsersAccessModules } from "../../use-cases/user/load-user-modules-factory";

export const makeGetUserAccessModulesController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["id"].map((field) => new RequiredFieldValidator(field));

  const validationComposite = new ValidatorComposite(validations);

  return makeLogControllerDecorator(
    new LoadUserAccessController(
      makeGetUsersAccessModules(),
      validationComposite
    )
  );
};
