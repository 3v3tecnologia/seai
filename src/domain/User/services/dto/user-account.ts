import { Either } from "../../../../shared/Either";
import { UserModulesNotFound } from "../../core/errors/invalid-modules";
import { LoginAlreadyExists } from "../../core/errors/login-aready-exists";
import { UserNotFoundError } from "../../core/errors/user-not-found-error";
import { WrongPasswordError } from "../../core/errors/wrong-password";

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
