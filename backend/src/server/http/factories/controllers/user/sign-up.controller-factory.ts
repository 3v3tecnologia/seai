import { SignUp } from "../../../../../domain/use-cases/user/sign-up";
import { BcryptAdapter } from "../../../../../infra/cryptography/bcrypt-adapter";
import { KnexAccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { SignUpController } from "../../../../../presentation/controllers/user-controller/sign-up.controller";
import { Validator } from "../../../../../shared/validation/ports/validator";
import { CompareFieldsValidation } from "../../../../../shared/validation/validator/compare-fields";
import { EmailValidator } from "../../../../../shared/validation/validator/email";
import { RequiredFieldValidator } from "../../../../../shared/validation/validator/required-field";
import { ValidatorComposite } from "../../../../../shared/validation/validator/validator-composite";
import { makeLogControllerDecorator } from "../../decorators";
import { makeUserAuthentication } from "../../use-cases/user/authentication-factory";

export const makeSignUpController = (): Controller => {
  let validations: Array<Validator> = [];

  validations = ["email", "name", "login", "password", "confirmPassword"].map(
    (field) => new RequiredFieldValidator(field)
  );

  validations.push(new EmailValidator());
  validations.push(new CompareFieldsValidation("password", "confirmPassword"));

  const validationComposite = new ValidatorComposite(validations);

  const accountRepository = new KnexAccountRepository();
  const authentication = makeUserAuthentication();
  const encoder = new BcryptAdapter();
  const signUp = new SignUp(accountRepository, authentication, encoder);

  return makeLogControllerDecorator(
    new SignUpController(signUp, validationComposite)
  );
};
