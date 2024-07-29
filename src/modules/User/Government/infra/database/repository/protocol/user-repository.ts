import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../../../domain/use-cases/helpers/pagination";
import { Optional } from "../../../../../../../shared/optional";
import { UserAccountProps } from "../../../../../core/model/account";
import { UserType, UserTypes } from "../../../../../core/model/user";
import { SystemModulesProps } from "../../../../../core/model/user-modules-access";

export interface UserRepositoryProtocol {
  add(data: {
    email: string;
    login?: string;
    name?: string;
    type: UserType;
    password?: string;
    modules?: SystemModulesProps;
    status?: string;
    code: string;
  }): Promise<number | null>;
  list(
    params: {
      name?: string;
      type?: Record<UserTypes, string>;
    } & IPaginationInput
  ): Promise<
    IOutputWithPagination<
      Optional<UserAccountProps, "id" | "name" | "code" | "status" | "login">
    >
  >;
  updateUserStatus(user_id: number, status: string): Promise<void>;
  update(data: {
    id?: number;
    code?: string;
    email?: string | null;
    name: string | null;
    login: string | null;
    type?: string | null;
    password?: string | null;
    modules?: SystemModulesProps | null;
  }): Promise<boolean>;
  updateUserPassword(user_id: number, password: string): Promise<void>;
  deleteById(id_user: number): Promise<boolean>;
  deleteByEmail(email: string): Promise<boolean>;
  getById(
    id_user: number
  ): Promise<Required<
    Optional<UserAccountProps, "id" | "name" | "code" | "status" | "login">
  > | null>;
  getByEmail(
    email: string,
    user_type?: UserType | Array<UserType>
  ): Promise<UserAccountProps | null>;
  getByLogin(
    login: string,
    user_type?: UserType | Array<UserType>
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
  getModules(): Promise<Array<{
    id: number;
    name: string;
  }> | null>;
  getUserModulesByName(
    id_user: number,
    name: string
  ): Promise<{
    id?: number;
    read: boolean;
    write: boolean;
  } | null>;
}
