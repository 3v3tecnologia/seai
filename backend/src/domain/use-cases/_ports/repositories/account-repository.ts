import {
  Modules,
  PermissionType,
  SystemModulesProps,
} from "../../../entities/user/user-modules-access";

export namespace AccountRepository {
  export type UserData = {
    id?: number;
    name?: string;
    login?: string;
    email: string;
    password?: string;
    type: string;
    createdAt?: string;
    updatedAt?: string;
  };

  export type userTypes = PermissionType;

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
    list(): Promise<Array<UserData> | null>;
  }

  export interface Update {
    update(data: {
      id: number;
      email: string;
      name: string;
      login: string;
      password: string;
    }): Promise<boolean>;
  }

  export interface DeleteById {
    deleteById(id_user: number): Promise<boolean>;
  }

  export interface GetById {
    getById(id_user: number): Promise<UserData | null>;
  }

  export interface GetByEmail {
    getByEmail(email: string): Promise<UserData | null>;
  }

  export interface GetByLogin {
    getByLogin(login: string): Promise<UserData | null>;
  }

  export interface CheckIfEmailExists {
    checkIfEmailAlreadyExists(email: string): Promise<boolean>;
  }

  export interface GetUserModulesPermissions {
    getUserModulesPermissions(
      id_user: number
    ): Promise<system_modules_permissions | null>;
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
    AccountRepository.GetUserModulesPermissions,
    AccountRepository.GetModules,
    AccountRepository.GetUserModuleByName {}
