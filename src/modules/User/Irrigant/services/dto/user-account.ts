import { Either } from "../../../../../shared/Either";
import { UserModulesNotFound } from "../../../core/model/errors/invalid-modules";
import { LoginAlreadyExists } from "../../../core/model/errors/login-aready-exists";
import { UserNotFoundError } from "../../../core/model/errors/user-not-found-error";
import { WrongPasswordError } from "../../../core/model/errors/wrong-password";

export namespace CreateIrrigantAccountDTO {
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
