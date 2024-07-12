import {
  IPaginationInput,
  IOutputWithPagination,
} from "./../../helpers/pagination";
import { UserType, UserTypes } from "../../../entities/user/user";
import { SystemModulesProps } from "../../../entities/user/user-modules-access";
import { User } from "../../user/model/user";
import { UserAccount } from "../../user/model/user-with-modules";

export interface AccountRepositoryProtocol {
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
  ): Promise<IOutputWithPagination<User>>;
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
  getByEmail(
    email: string,
    user_type?: UserType | Array<UserType>
  ): Promise<User | null>;
  getByLogin(
    login: string,
    user_type?: UserType | Array<UserType>
  ): Promise<Required<UserAccount> | null>;
  getById(id_user: number): Promise<Required<User> | null>;
  getUserByCode(code: string): Promise<User | null>;
  checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  checkIfLoginAlreadyExists(login: string): Promise<boolean>;
  getUserById(id_user: number): Promise<User | null>;
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
