import { UserType, UserTypes } from "../../../entities/user/user";
import { SystemModulesProps } from "../../../entities/user/user-modules-access";
import { User } from "../../user/model/user";
import { UserAccount } from "../../user/model/user-with-modules";
import { IInputWithPagination } from "./dto/input";
import { IOuputWithPagination } from "./dto/output";

export interface AccountRepositoryProtocol {
  add(data: {
    email: string;
    type: UserType;
    modules: SystemModulesProps;
  }): Promise<number | null>;
  list(
    params: {
      name?: string;
      type?: Record<UserTypes, string>;
    } & IInputWithPagination
  ): Promise<IOuputWithPagination<User>>;
  update(data: {
    id: number;
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
  getByEmail(email: string): Promise<User | null>;
  getByLogin(login: string): Promise<Required<UserAccount> | null>;
  getById(id_user: number): Promise<Required<UserAccount> | null>;
  checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  getUserById(id_user: number): Promise<{
    id: number;
    name: string;
    login: string;
    email: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    modules: SystemModulesProps | null;
  } | null>;
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
