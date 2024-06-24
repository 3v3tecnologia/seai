import { WrongPasswordError } from "../../../../../domain/use-cases/user/authentication/errors";
import { LoginAlreadyExists } from "../../../../../domain/use-cases/user/errors/login-aready-exists";
import {
  AccountEmailNotFound,
  AccountNotFoundError,
  UserModulesNotFound,
} from "../../../../../domain/use-cases/user/errors/user-account-not-found";
import { Either } from "../../../../../shared/Either";

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
