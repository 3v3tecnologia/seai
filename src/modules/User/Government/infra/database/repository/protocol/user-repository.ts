import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../../../domain/use-cases/helpers/pagination";
import { User, UserType, UserTypes } from "../../../../model/user";
import { SystemModulesProps } from "../../../../model/user-modules-access";
import { UserAccount } from "../../../../services/model/user-with-modules";

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
  ): Promise<IOutputWithPagination<User>>;
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
  getById(id_user: number): Promise<Required<UserAccount> | null>;
  getByEmail(
    email: string,
    user_type?: UserType | Array<UserType>
  ): Promise<UserAccount | null>;
  getByLogin(
    login: string,
    user_type?: UserType | Array<UserType>
  ): Promise<UserAccount | null>;
  getUserById(id_user: number): Promise<UserAccount | null>;
  getUserByCode(code: string): Promise<UserAccount | null>;
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
