import { UserType, UserTypes } from "../../../../domain/entities/user/user";
import {
  Modules,
  SystemModulesProps,
} from "../../../../domain/entities/user/user-modules-access";
import { AccountRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/account-repository";
import { IOutputWithPagination, IPaginationInput, toPaginatedOutput } from "../../../../domain/use-cases/helpers/pagination";
import { User } from "../../../../domain/use-cases/user/model/user";
import { UserAccount } from "../../../../domain/use-cases/user/model/user-with-modules";
import { governmentDb } from "../connection/knexfile";
import { countTotalRows } from "./utils/paginate";

export class DbAccountRepository implements AccountRepositoryProtocol {
  async add(params: {
    email: string;
    type: UserType;
    modules: SystemModulesProps,
    code: string,
  }): Promise<number | null> {
    let id_user = null;
    await governmentDb.transaction(async (trx) => {
      const id = await trx
        .insert({
          Email: params.email,
          Type: params.type,
          Code: params.code,
          Status: 'pending',
          CreatedAt: governmentDb.fn.now(),
        })
        .returning("Id")
        .into("User");

      const user_id = id.length && id[0].Id;

      // Refactor: Bulk insert
      // Refactor: add user permissions mapper
      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: params.modules[Modules.NEWS].id,
          Read: params.modules[Modules.NEWS].read,
          Write: params.modules[Modules.NEWS].write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: params.modules[Modules.REGISTER].id,
          Read: params.modules[Modules.REGISTER].read,
          Write: params.modules[Modules.REGISTER].write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: params.modules[Modules.USER].id,
          Read: params.modules[Modules.USER].read,
          Write: params.modules[Modules.USER].write,
        })
        .into("User_Access");

      await trx
        .insert({
          Fk_User: user_id,
          Fk_Module: params.modules[Modules.JOBS].id,
          Read: params.modules[Modules.JOBS].read,
          Write: params.modules[Modules.JOBS].write,
        })
        .into("User_Access");

      id_user = user_id;
    });

    return id_user;
  }

  async getModules(): Promise<Array<{
    id: number;
    name: string;
  }> | null> {
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
  async getUserByCode(code: string): Promise<User | null> {
    const result = await governmentDb
      .select("Id", "Name", "Login", "Email", "Type", "Code", "Status", "CreatedAt", "UpdatedAt")
      .where({ Code: code })
      .from("User")
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Email, Type, CreatedAt, UpdatedAt, Code, Status } = result;

    const user: User = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      type: Type,
      createdAt: CreatedAt,
      updatedAt: UpdatedAt,
      code: Code,
      status: Status,
    };

    return user;
  }
  async getUserById(id_user: number): Promise<User | null> {
    const result = await governmentDb
      .select("Id", "Name", "Login", "Code", "Status", "Email", "Type", "CreatedAt", "UpdatedAt")
      .where({ Id: id_user })
      .from("User")
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Code, Status, Email, Type, CreatedAt, UpdatedAt } = result;

    const user: User = {
      id: Id,
      name: Name,
      login: Login,
      code: Code,
      status: Status,
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

  async list(
    params: {
      name?: string;
      type?: Record<UserTypes, string>;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<User>> {
    const { pageNumber, limit, offset, name, type } = params;

    const pageLimit = limit;

    const binding = [];
    const queries: Array<any> = [];

    if (name) {
      queries.push(
        `WHERE (to_tsvector('simple', coalesce(u."Name", ''))) @@ to_tsquery('simple', '${name}:*')`
      );
    }

    if (type) {
      const baseWhere = `WHERE u."Type" = ?`;
      if (queries.length) {
        queries.push(`AND ${baseWhere}`);
      } else {
        queries.push(baseWhere);
      }
      binding.push(type);
    }

    const countSQL = `
      SELECT count(*)  FROM "User" u  ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(governmentDb)(countSQL, binding);

    queries.push(`order by u."Id" LIMIT ? OFFSET ?`);
    binding.push(pageLimit);
    binding.push(offset);

    const getUsersSQL = `
      SELECT
          u."Id" ,
          u."Name" ,
          u."Login" ,
          u."Email" ,
          u."Password" ,
          u."Type" ,
          u."CreatedAt" ,
          u."UpdatedAt"
      FROM
          "User" u
      ${queries.join(" ")}
    `;

    const response = await governmentDb.raw(getUsersSQL, binding);

    const rows = response.rows;

    if (!rows) {
      return null;
    }

    const users = rows.map((row: any) => {
      // const modules = await this.getUserModules(user.Id);

      return {
        id: Number(row.Id),
        name: row.Name,
        login: row.Login,
        email: String(row.Email),
        type: String(row.Type),
        createdAt: String(row.CreatedAt),
        updatedAt: String(row.UpdatedAt),
      };
    });

    return toPaginatedOutput({
      data: users,
      page: pageNumber,
      count: countRows,
      limit: pageLimit,
    });
  }

  async updateUserPassword(user_id: number, password: string): Promise<void> {
    await governmentDb("User").where({ Id: user_id }).update({
      Password: password,
      UpdatedAt: governmentDb.fn.now(),
    });
  }

  async update(data: {
    id?: number;
    code?: string;
    email?: string | null;
    name: string | null;
    login: string | null;
    type?: string | null;
    password?: string | null;
    modules?: SystemModulesProps | null;
  }): Promise<boolean> {
    let result = false;
    await governmentDb.transaction(async (trx) => {
      const userToUpdate = {
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
      if (data.email) {
        Object.assign(userToUpdate, {
          Email: data.email,
        });
      }

      if (data.id) {
        await trx("User").where({ Id: data.id }).update(userToUpdate);
      }
      else {
        await trx("User").where({ Code: data.code }).update(userToUpdate);
      }

      if (data.modules) {
        await trx("User_Access")
          .where({ Fk_User: data.id, Fk_Module: data.modules[Modules.NEWS].id })
          // .andWhere({ Fk_Module: data.modules[Modules.NEWS].id })
          .update({
            Read: data.modules[Modules.NEWS].read,
            Write: data.modules[Modules.NEWS].write,
          });

        await trx("User_Access")
          .where({ Fk_User: data.id, Fk_Module: data.modules[Modules.JOBS].id })
          // .andWhere({ Fk_Module: data.modules[Modules.NEWS].id })
          .update({
            Read: data.modules[Modules.JOBS].read,
            Write: data.modules[Modules.JOBS].write,
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

  async getByEmail(email: string): Promise<User | null> {
    const result = await governmentDb
      .select("*")
      .from("User")
      .where("Email", email)
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Code, Status, Email, Password, Type, CreatedAt, UpdatedAt } =
      result;

    const user: User = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      code: Code,
      status: Status,
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

  async getByLogin(login: string): Promise<Required<UserAccount> | null> {
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

  async getById(id_user: number): Promise<Required<User> | null> {
    const result = await governmentDb
      .select("*")
      .from("User")
      .where({ Id: id_user })
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Code, Status, Email, Password, Type, CreatedAt, UpdatedAt } =
      result;

    const user: Required<User> = {
      id: Id,
      name: Name,
      login: Login,
      email: Email,
      code: Code,
      status: Status,
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
