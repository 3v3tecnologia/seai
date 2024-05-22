
import { UserType, UserTypes } from "../../../core/model/user";
import { SystemModulesProps } from "../../../core/model/user-modules-access";
import { BaseUserModel } from "../../../core/model/base-user";
import { IOutputWithPagination, IPaginationInput } from "../../../../../shared/core/pagination";


export interface AccountRepositoryProtocol {
  add(data: {
    email: string;
    type: UserType;
    modules: SystemModulesProps;
    code: string;
  }): Promise<number | null>;
  list(
    params: {
      name?: string;
      type?: Record<UserTypes, string>;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<BaseUserModel>>;
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
  getByEmail(email: string): Promise<BaseUserModel | null>;
  getByLogin(login: string): Promise<BaseUserModel | null>;
  getById(id_user: number): Promise<Required<BaseUserModel> | null>;
  getUserByCode(code: string): Promise<BaseUserModel | null>
  checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  checkIfLoginAlreadyExists(login: string): Promise<boolean>
  getUserById(id_user: number): Promise<BaseUserModel | null>;
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
