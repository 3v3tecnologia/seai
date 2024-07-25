import { Either } from "../../../../../shared/Either";
import { UserModulesNotFound } from "../../../Government/model/errors/invalid-modules";
import { LoginAlreadyExists } from "../../../Government/model/errors/login-aready-exists";
import { UserNotFoundError } from "../../../Government/model/errors/user-not-found-error";
import { WrongPasswordError } from "../../../Government/model/errors/wrong-password";

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
