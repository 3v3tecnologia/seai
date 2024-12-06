import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../shared/utils/pagination";
import { Optional } from "../../../../../shared/optional";
import { UserCommandOperationProps } from "../../../../Logs/core/protocols/logger";
import { SystemModulesProps } from "../../../core/model/user-modules-access";
import { UserType, UserTypes } from "../../../core/model/gov-user";
import { UserStatus } from "../../../core/model/status";

export type UserAccountProps = {
  id: number;
  name: string;
  code: string;
  status: UserStatus;
  login: string;
  email: string;
  type: string;
  password?: string;
  modules?: SystemModulesProps | null;
  updatedAt?: string;
  createdAt?: string;
};
export interface UserRepositoryProtocol {
  add(
    user: {
      type: UserType;
      code: string;
      status?: string;
      email: string;
      login?: string;
      name?: string;
      password?: string;
      modules?: SystemModulesProps;
    },
    author?: number
  ): Promise<number | null>;
  list(
    params: {
      name?: string;
      status?: UserStatus;
      type?: Record<UserTypes, string>;
    } & IPaginationInput
  ): Promise<
    IOutputWithPagination<
      Optional<UserAccountProps, "id" | "name" | "code" | "status" | "login">
    >
  >;
  checkIfNameAlreadyExists(
    name: string,
    user_type?: UserType | Array<UserType>
  ): Promise<boolean>;
  updateUserStatus(user_id: number, status: string): Promise<void>;
  update(
    user: {
      id?: number;
      code?: string;
      email?: string | null;
      name: string | null;
      login: string | null;
      type?: string | null;
      password?: string | null;
      modules?: SystemModulesProps | null;
    },
    operation?: UserCommandOperationProps
  ): Promise<boolean>;
  updateUserPassword(user_id: number, password: string): Promise<void>;
  deleteById(
    id_user: number,
    operation?: UserCommandOperationProps
  ): Promise<void>;
  getById(
    id_user: number
  ): Promise<Required<
    Optional<UserAccountProps, "id" | "name" | "code" | "status" | "login">
  > | null>;
  getByEmail(
    email: string,
    status?: UserStatus,
    type?: UserType
  ): Promise<UserAccountProps | null>;
  getByLogin(
    login: string,
    status?: UserStatus
  ): Promise<UserAccountProps | null>;
  getUserById(
    id_user: number
  ): Promise<Optional<
    UserAccountProps,
    "id" | "name" | "code" | "status" | "login"
  > | null>;
  getUserByCode(code: string): Promise<UserAccountProps | null>;
  checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  checkIfLoginAlreadyExists(login: string): Promise<boolean>;
  getModules(): Promise<
    Array<{
      id: number;
      name: string;
    }>
  >;
  getUserModulesByName(
    id_user: number,
    name: string
  ): Promise<{
    id?: number;
    read: boolean;
    write: boolean;
  } | null>;
}
