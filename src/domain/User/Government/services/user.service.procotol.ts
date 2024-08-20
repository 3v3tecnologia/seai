import { Either } from "../../../../shared/Either";
import { Optional } from "../../../../shared/optional";
import { IPaginationInput } from "../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../Logs/protocols/logger";
import { FailToDeleteUserError } from "../../lib/errors/fail-to-delete-user-error";
import { UserModulesNotFound } from "../../lib/errors/invalid-modules";
import { LoginAlreadyExists } from "../../lib/errors/login-aready-exists";
import { UserAlreadyExistsError } from "../../lib/errors/user-already-exists";
import { UserNotFoundError } from "../../lib/errors/user-not-found-error";
import { WrongPasswordError } from "../../lib/errors/wrong-password";
import { UserAccountProps } from "../infra/database/repository/protocol/user-repository";
import { UserType, UserTypes } from "../model/user";
import { SystemModulesProps } from "../model/user-modules-access";

export interface IUserService {
  create(
    request: {
      email: string;
      type: UserType;
      modules: SystemModulesProps;
    },
    author: number
  ): Promise<Either<UserAlreadyExistsError | Error, string>>;
  login({
    login,
    password,
    email,
  }: {
    login?: string;
    email?: string;
    password: string;
  }): Promise<
    Either<
      Error,
      {
        accessToken: string;
        // accountId: number;
      }
    >
  >;
  completeRegister(user: {
    code: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  }): Promise<
    Either<
      | UserNotFoundError
      | WrongPasswordError
      | LoginAlreadyExists
      | UserModulesNotFound,
      string
    >
  >;
  forgotPassword(email: string): Promise<Either<Error, string>>;
  resetPassword(params: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<Either<Error, null>>;
  deleteUser(
    request: { id?: number; email?: string },
    operation: UserCommandOperationProps
  ): Promise<Either<UserNotFoundError | FailToDeleteUserError, string>>;
  getProfile(id: number): Promise<
    Either<
      Error,
      {
        createdAt: string;
        email: string;
        login: string;
        name: string;
        type: string;
        updatedAt: string;
      }
    >
  >;
  updateProfile(request: {
    id: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<Either<UserNotFoundError | LoginAlreadyExists, string>>;
  getUsers(
    request: {
      id?: number;
      name?: string;
      type?: Record<UserTypes, string>;
    } & Partial<IPaginationInput>
  ): Promise<
    Either<
      Error,
      | Optional<UserAccountProps, "id" | "name" | "code" | "status" | "login">
      | any
    >
  >;
  updateUser(
    request: {
      id: number;
      email: string;
      type: UserType;
      name: string;
      login: string;
      modules?: SystemModulesProps;
    },
    operation: UserCommandOperationProps
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError | LoginAlreadyExists, string>
  >;
  getUserById(
    userId: number
  ): Promise<
    Either<
      Error,
      Optional<
        UserAccountProps,
        "id" | "name" | "code" | "status" | "login"
      > | null
    >
  >;
  getSystemModules(): Promise<
    Either<
      Error,
      Array<{
        id: number;
        name: string;
      }>
    >
  >;
}
