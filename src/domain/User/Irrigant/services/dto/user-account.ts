import { Either } from "../../../../../shared/Either";
import { UserModulesNotFound } from "../../../lib/errors/invalid-modules";
import { LoginAlreadyExists } from "../../../lib/errors/login-aready-exists";
import { UserNotFoundError } from "../../../lib/errors/user-not-found-error";
import { WrongPasswordError } from "../../../lib/errors/wrong-password";

export namespace CreateIrrigationAccountDTO {
  export type Input = {
    login: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  export type Output = Either<
    | UserNotFoundError
    | WrongPasswordError
    | LoginAlreadyExists
    | UserModulesNotFound,
    any
  >;
}
