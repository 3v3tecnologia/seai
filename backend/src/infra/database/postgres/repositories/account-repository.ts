import { UserType } from "../../../../domain/entities/user/user";
import {
  Modules,
  SystemModulesProps,
} from "../../../../domain/entities/user/user-modules-access";
import {
  AccountRepository,
  AccountRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/account-repository";
import { governmentDb } from "../connection/knexfile";

export class KnexAccountRepository implements AccountRepositoryProtocol {
  async add(data: {
    email: string;
    type: UserType;
    modules: AccountRepository.system_modules_permissions;
  }): Promise<number | null> {
    let id_user = null;
    await governmentDb.transaction(async (trx) => {
      const id = await trx
        .insert({
          Email: data.email,
          Type: data.type,
          CreatedAt: governmentDb.fn.now(),
        })
        .returning("Id")
        .into("User");

      const user_id = id.length && id[0].Id;

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: data.modules[Modules.NEWS].id,
          Read: data.modules[Modules.NEWS].read,
          Write: data.modules[Modules.NEWS].write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: data.modules[Modules.REGISTER].id,
          Read: data.modules[Modules.REGISTER].read,
          Write: data.modules[Modules.REGISTER].write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: data.modules[Modules.USER].id,
          Read: data.modules[Modules.USER].read,
          Write: data.modules[Modules.USER].write,
        })
        .into("User_Access");

      id_user = user_id;
    });

    return id_user;
  }

  async getModules(): Promise<Array<AccountRepository.AccountModulesData> | null> {
    const modules = await governmentDb.select("*").from("Module");

    if (!modules) {
      return null;
    }
    return modules.map((module) => {
      return {
        id: module.Id,
        name: module.Name,
      };
    });
  }
  async getUserById(
    id_user: number
  ): Promise<Required<AccountRepository.UserData> | null> {
    const result = await governmentDb
      .select("Id", "Name", "Login", "Email", "Type", "CreatedAt", "UpdatedAt")
      .where({ Id: id_user })
      .from("User")
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Email, Type, CreatedAt, UpdatedAt } = result;

    const user: {
      id: number;
      name: string;
      login: string;
      email: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      modules: SystemModulesProps | null;
    } = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      type: Type,
      createdAt: CreatedAt,
      updatedAt: UpdatedAt,
      modules: null,
    };

    const modules = await this.getUserModules(id_user);

    if (modules) {
      Object.assign(user, {
        modules,
      });
    }

    return user;
  }
  async getUserModules(id_user: number): Promise<SystemModulesProps | null> {
    const result = await governmentDb
      .select("*")
      .where({ Fk_User: id_user })
      .from("User_Access")
      .innerJoin("Module", "Module.Id", "User_Access.Fk_Module");

    if (!result.length) {
      return null;
    }

    const modules = result.reduce((prev: any, current) => {
      return Object.assign(prev, {
        [current.Name]: {
          id: Number(current.Id),
          read: Boolean(current.Read),
          write: Boolean(current.Write),
        },
      });
    }, {});

    return modules as SystemModulesProps;
  }
  async getUserModulesByName(
    id_user: number,
    name: string
  ): Promise<{
    id?: number;
    read: boolean;
    write: boolean;
  } | null> {
    const module = await governmentDb
      .select("*")
      .where({ Fk_User: id_user })
      .andWhere({ Name: name })
      .from("User_Access")
      .innerJoin("Module", "Module.Id", "User_Access.Fk_Module")
      .first();

    if (!module) {
      return null;
    }

    const mods = { id: module.Id, read: module.Read, write: module.Write };

    return mods;
  }

  async list(): Promise<Array<Required<AccountRepository.UserData>> | null> {
    const result = await governmentDb.select("*").from("User");

    if (!result) {
      return null;
    }

    const users = result.map((user) => {
      // const modules = await this.getUserModules(user.Id);

      return {
        id: Number(user.Id),
        name: user.Name,
        login: user.Login,
        email: String(user.Email),
        type: String(user.Type),
        createdAt: String(user.CreatedAt),
        updatedAt: String(user.UpdatedAt),
        modules: null,
      };
    });

    return users;
  }

  async updateUserPassword(user_id: number, password: string): Promise<void> {
    await governmentDb("User").where({ Id: user_id }).update({
      Password: password,
      UpdatedAt: governmentDb.fn.now(),
    });
  }

  async update(data: {
    id: number;
    email: string | null;
    name: string | null;
    login: string | null;
    type?: string | null;
    password?: string;
    modules?: AccountRepository.system_modules_permissions | null;
  }): Promise<boolean> {
    let result = false;
    await governmentDb.transaction(async (trx) => {
      const userToUpdate = {
        Email: data.email,
        Name: data.name,
        Login: data.login,
        UpdatedAt: governmentDb.fn.now(),
      };

      if (data.password) {
        Object.assign(userToUpdate, {
          Password: data.password,
        });
      }
      if (data.type) {
        Object.assign(userToUpdate, {
          Type: data.type,
        });
      }

      await trx("User").where({ Id: data.id }).update(userToUpdate);

      if (data.modules) {
        await trx("User_Access")
          .where({ Fk_User: data.id, Fk_Module: data.modules[Modules.NEWS].id })
          // .andWhere({ Fk_Module: data.modules[Modules.NEWS].id })
          .update({
            Read: data.modules[Modules.NEWS].read,
            Write: data.modules[Modules.NEWS].write,
          });

        await trx("User_Access")
          .where({
            Fk_User: data.id,
            Fk_Module: data.modules[Modules.REGISTER].id,
          })
          // .andWhere({ Fk_Module: data.modules[Modules.REGISTER].id })
          .update({
            Read: data.modules[Modules.REGISTER].read,
            Write: data.modules[Modules.REGISTER].write,
            UpdatedAt: governmentDb.fn.now(),
          });

        await trx("User_Access")
          .where({ Fk_User: data.id, Fk_Module: data.modules[Modules.USER].id })
          // .andWhere({ Fk_Module: data.modules[Modules.USER].id })
          .update({
            Read: data.modules[Modules.USER].read,
            Write: data.modules[Modules.USER].write,
            UpdatedAt: governmentDb.fn.now(),
          });
      }

      result = true;
    });

    return result;
  }

  async getByEmail(
    email: string
  ): Promise<Required<AccountRepository.UserData> | null> {
    const result = await governmentDb
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Email, Password, Type, CreatedAt, UpdatedAt } =
      result;

    const user: {
      id: number;
      name: string;
      login: string;
      email: string;
      password: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      modules: SystemModulesProps | null;
    } = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      type: Type,
      password: Password,
      createdAt: CreatedAt,
      updatedAt: UpdatedAt,
      modules: null,
    };

    const modules = await this.getUserModules(Id);

    if (modules) {
      Object.assign(user, {
        modules,
      });
    }

    return user;
  }

  async getByLogin(
    login: string
  ): Promise<Required<AccountRepository.FullUserData> | null> {
    const result = await governmentDb
      .select("*")
      .from("User")
      .where("Login", login)
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Email, Password, Type, CreatedAt, UpdatedAt } =
      result;

    const user: {
      id: number;
      name: string;
      login: string;
      email: string;
      password: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      modules: SystemModulesProps | null;
    } = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      type: Type,
      password: Password,
      createdAt: CreatedAt,
      updatedAt: UpdatedAt,
      modules: null,
    };

    const modules = await this.getUserModules(Id);

    if (modules) {
      Object.assign(user, {
        modules,
      });
    }

    return user;
  }

  async deleteById(id_user: number): Promise<boolean> {
    await governmentDb("User").where("Id", id_user).del();
    return true;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    await governmentDb("User").where("Email", email).del();
    return true;
  }

  async getById(
    id_user: number
  ): Promise<Required<AccountRepository.FullUserData> | null> {
    const result = await governmentDb
      .select("*")
      .from("User")
      .where({ Id: id_user })
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Email, Password, Type, CreatedAt, UpdatedAt } =
      result;

    const user: {
      id: number;
      name: string;
      login: string;
      email: string;
      password: string;
      type: string;
      createdAt: string;
      updatedAt: string;
      modules: SystemModulesProps | null;
    } = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      type: Type,
      password: Password,
      createdAt: CreatedAt,
      updatedAt: UpdatedAt,
      modules: null,
    };

    const modules = await this.getUserModules(Id);

    if (modules) {
      Object.assign(user, {
        modules,
      });
    }

    return user;
  }

  async checkIfEmailAlreadyExists(email: string): Promise<boolean> {
    const user = await governmentDb
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

    return user ? true : false;
  }
}
