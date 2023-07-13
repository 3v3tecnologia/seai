import {
  AccountRepository,
  AccountRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/account-repository";
import { governmentDb } from "../connection/knexfile";

export class KnexAccountRepository implements AccountRepositoryProtocol {
  async add(data: {
    email: string;
    type: "admin" | "standard";
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
          Fk_Module: data.modules.news_manager.id,
          Read: data.modules.news_manager.read,
          Write: data.modules.news_manager.write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: data.modules.registers.id,
          Read: data.modules.registers.read,
          Write: data.modules.registers.write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: data.modules.users_manager.id,
          Read: data.modules.users_manager.read,
          Write: data.modules.users_manager.write,
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
  async getUserModulesPermissions(
    id_user: number
  ): Promise<AccountRepository.system_modules_permissions | null> {
    const modules = await governmentDb
      .select("*")
      .where({ Fk_User: id_user })
      .from("User_Access")
      .innerJoin("Module", "Module.Id", "User_Access.Fk_Module");

    if (!modules) {
      return null;
    }

    const mods = {} as AccountRepository.system_modules_permissions;

    modules.forEach((module) => {
      Object.assign(mods, {
        [module.Name]: {
          id: module.Id,
          read: module.Read,
          write: module.Write,
        },
      });
    });

    return mods;
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

  async list(): Promise<Array<AccountRepository.UserData> | null> {
    const users = await governmentDb.select("*").from("User");

    if (!users) {
      return null;
    }
    return users.map((user) => {
      return {
        id: user.Id,
        name: user.Name,
        login: user.Login,
        email: user.Email,
        type: user.Type,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
      };
    });
  }

  async update(data: {
    id: number;
    email: string;
    name: string;
    login: string;
    password: string;
  }): Promise<boolean> {
    const rows = await governmentDb("User").where({ Id: data.id }).update({
      Email: data.email,
      Name: data.name,
      Login: data.login,
      Password: data.password,
      UpdatedAt: governmentDb.fn.now(),
    });

    return rows > 0;
  }

  async getByEmail(email: string): Promise<AccountRepository.UserData | null> {
    const user = await governmentDb
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user.Id,
      name: user.Name,
      login: user.Login,
      email: user.Email,
      password: user.Password,
      type: user.Type,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
  }

  async getByLogin(login: string): Promise<AccountRepository.UserData | null> {
    const user = await governmentDb
      .select("*")
      .from("User")
      .where("Login", login)
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user.Id,
      name: user.Name,
      login: user.Login,
      email: user.Email,
      password: user.Password,
      type: user.Type,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
  }

  async deleteById(id_user: number): Promise<boolean> {
    await governmentDb("User").where("Id", id_user).del();
    return true;
  }

  async getById(id_user: number): Promise<AccountRepository.UserData | null> {
    const user = await governmentDb
      .select("*")
      .from("User")
      .where({ Id: id_user })
      .first();

    if (!user) {
      return null;
    }

    return {
      id: user.Id,
      name: user.Name,
      login: user.Login,
      email: user.Email,
      password: user.Password,
      type: user.Type,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
    };
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
