import { UserType } from "../../../entities/user/user";
import { SystemModulesProps } from "../../../entities/user/user-modules-access";

export namespace AccountRepository {
  export type UserData = {
    id?: number;
    name?: string;
    login?: string;
    email: string;
    type: string;
    createdAt?: string;
    modules?: SystemModulesProps | null;
    updatedAt?: string;
  };

  export type FullUserData = UserData & { password: string };

  export type userTypes = UserType;

  export type AccountModulesData = {
    id: number;
    name: string;
  };

  export type system_modules_permissions = SystemModulesProps;

  export interface Add {
    add(data: {
      email: string;
      type: userTypes;
      modules: system_modules_permissions;
    }): Promise<number | null>;
  }

  export interface Fetch {
    list(): Promise<Array<Required<AccountRepository.UserData>> | null>;
  }

  export interface Update {
    update(data: {
      id: number;
      email: string | null;
      name: string | null;
      login: string | null;
      type?: string | null;
      password?: string | null;
      modules?: AccountRepository.system_modules_permissions | null;
    }): Promise<boolean>;
  }

  export interface DeleteById {
    deleteById(id_user: number): Promise<boolean>;
  }

  export interface GetById {
    getById(
      id_user: number
    ): Promise<Required<AccountRepository.FullUserData> | null>;
  }

  export interface GetByEmail {
    getByEmail(
      email: string
    ): Promise<Required<AccountRepository.UserData> | null>;
  }

  export interface GetByLogin {
    getByLogin(
      login: string
    ): Promise<Required<AccountRepository.FullUserData> | null>;
  }

  export interface CheckIfEmailExists {
    checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  }

  export interface GetUserById {
    getUserById(
      id_user: number
    ): Promise<Required<AccountRepository.UserData> | null>;
  }

  export interface GetModules {
    getModules(): Promise<Array<AccountModulesData> | null>;
  }

  export interface GetUserModuleByName {
    getUserModulesByName(
      id_user: number,
      name: string
    ): Promise<{
      id?: number;
      read: boolean;
      write: boolean;
    } | null>;
  }
}

export interface AccountRepositoryProtocol
  extends AccountRepository.Add,
    AccountRepository.Fetch,
    AccountRepository.Update,
    AccountRepository.DeleteById,
    AccountRepository.GetById,
    AccountRepository.GetByEmail,
    AccountRepository.GetByLogin,
    AccountRepository.CheckIfEmailExists,
    AccountRepository.GetUserById,
    AccountRepository.GetModules,
    AccountRepository.GetUserModuleByName {}
