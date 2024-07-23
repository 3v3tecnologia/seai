import { Either } from "../../../../../shared/Either";
import { WrongPasswordError } from "../../../Government/services/authentication/errors";
import { LoginAlreadyExists } from "../../../Government/services/errors/login-aready-exists";
import {
  AccountEmailNotFound,
  AccountNotFoundError,
  UserModulesNotFound,
} from "../../../Government/services/errors/user-account-not-found";

export namespace CreateIrrigantAccountDTO {
  export type Input = {
    login: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };

  export type Output = Either<
    | AccountEmailNotFound
    | AccountNotFoundError
    | WrongPasswordError
    | LoginAlreadyExists
    | UserModulesNotFound,
    any
  >;
}
