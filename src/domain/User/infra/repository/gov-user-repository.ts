import {
  governmentDb,
  logsDb,
} from "../../../../shared/infra/database/postgres/connection/knexfile";
import {
  IOutputWithPagination,
  IPaginationInput,
  toPaginatedOutput,
} from "../../../../shared/utils/pagination";

import { UserCommandOperationProps } from "../../../Logs/core/protocols/logger";
import { UserType, UserTypes } from "../../core/model/gov-user";
import { UserStatus } from "../../core/model/status";
import {
  SystemModulesPermissions,
  SystemModulesProps,
} from "../../core/model/user-modules-access";

import { getPaginatedResult } from "../../../../shared/infra/database/pagination";
import {
  UserAccountProps,
  UserRepositoryProtocol,
} from "./protocol/gov-user-repository";

function mapUserModulePermissionsToPersistence(
  user_id: number,
  modules: SystemModulesProps
) {
  return Object.entries(modules).map(([_, permissions]) => {
    return {
      Fk_User: user_id,
      Fk_Module: permissions.id,
      Read: permissions.read,
      Write: permissions.write,
    };
  });
}

export class GovernmentUserRepository implements UserRepositoryProtocol {

  async add(
    user: {
      type: UserType;
      code: string;
      status?: string;
      email: string;
      login?: string;
      name?: string;
      password?: string;
      modules?: SystemModulesProps;
    },
    author?: number
  ): Promise<number | null> {
    let id_user = null;
    await governmentDb.transaction(async (trx) => {
      const toInsert = {
        Email: user.email,
        Name: user.name,
        Type: user.type,
        Code: user.code,
        Status: user.status || "pending",
        CreatedAt: governmentDb.fn.now(),
      };

      if (user.login) {
        Object.assign(toInsert, {
          Login: user.login,
        });
      }

      if (user.name) {
        Object.assign(toInsert, {
          Name: user.name,
        });
      }

      if (user.password) {
        Object.assign(toInsert, {
          Password: user.password,
        });
      }

      const id = await trx
        .withSchema("users")
        .insert(toInsert)
        .returning("Id")
        .into("User");

      const user_id = id.length && id[0].Id;

      if (user.modules) {
        // Refactor: Bulk insert
        // Refactor: add user permissions mapper
        const permissions = mapUserModulePermissionsToPersistence(
          user_id,
          user.modules
        );

        await trx.batchInsert("users.User_Access", permissions);
      }

      id_user = user_id;
    });

    if (author) {
      await logsDb
        .insert({
          User_Id: author,
          Resource: "user",
          Operation: "create",
          Description: "Criação de usuário",
        })
        .withSchema("users")
        .into("Operations");
    }

    return id_user;
  }

  async getModules(): Promise<
    Array<{
      id: number;
      name: string;
    }>
  > {
    const modules = await governmentDb
      .withSchema("users")
      .select("*")
      .from("Module");

    return modules.map((module) => {
      return {
        id: module.Id,
        name: module.Name,
      };
    });
  }
  async getUserByCode(code: string): Promise<UserAccountProps | null> {
    const result = await governmentDb
      .withSchema("users")
      .select(
        "Id",
        "Name",
        "Login",
        "Email",
        "Type",
        "Code",
        "Status",
        "CreatedAt",
        "UpdatedAt"
      )
      .where({ Code: code })
      .from("User")
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Email, Type, CreatedAt, UpdatedAt, Code, Status } =
      result;

    const user: UserAccountProps = {
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
  async getUserById(id_user: number): Promise<UserAccountProps | null> {
    const result = await governmentDb
      .withSchema("users")
      .select(
        "Id",
        "Name",
        "Login",
        "Code",
        "Status",
        "Email",
        "Type",
        "CreatedAt",
        "UpdatedAt"
      )
      .whereNull("Deleted_At")
      .where({ Id: id_user })
      .from("User")
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Code, Status, Email, Type, CreatedAt, UpdatedAt } =
      result;

    const user: UserAccountProps = {
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
      const logsPermissions: SystemModulesPermissions = {
        write: false,
        read: false,
      };

      // TO-DO: add logs permissions control to Database
      if (user.type === "admin") {
        Object.assign(logsPermissions, {
          write: true,
          read: true,
        });
      }

      Object.assign(modules, {
        logs: logsPermissions,
      });

      Object.assign(user, {
        modules,
      });
    }

    return user;
  }
  async getUserModules(id_user: number): Promise<SystemModulesProps | null> {
    const result = await governmentDb
      .withSchema("users")
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
      .withSchema("users")
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
      status?: UserStatus;
      type?: Record<UserTypes, string>;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<UserAccountProps>> {
    const { pageNumber, limit, name, type, status } = params;

    const pageLimit = limit;

    const query = governmentDb
      .withSchema("users")
      .select(
        "u.Id",
        "u.Name",
        "u.Login",
        "u.Email",
        "u.Password",
        "u.Type",
        "u.CreatedAt",
        "u.UpdatedAt")
      .from("User as u")
      .whereNull("Deleted_At")

    if (name) {
      query.whereRaw(`to_tsvector('simple', coalesce(u."Name", '')) @@ to_tsquery('simple', '${name}:*')`)
    }

    if (status) {
      query.where("u.Status", status)
    }

    query.whereRaw(`u."Type" IN ('admin'::users.user_types,'standard'::users.user_types )`)

    if (type) {
      query.where("u.Type", type)
    }

    const { count, rows } = await getPaginatedResult(
      query,
      params.limit,
      params.offset
    );


    const users = rows.map((row: any) => {
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
      count,
      limit: pageLimit,
    });
  }

  async updateUserPassword(user_id: number, password: string): Promise<void> {
    await governmentDb("User")
      .withSchema("users")
      .where({ Id: user_id })
      .update({
        Password: password,
        UpdatedAt: governmentDb.fn.now(),
      });
  }

  async updateUserStatus(user_id: number, status: string): Promise<void> {
    await governmentDb("User")
      .withSchema("users")
      .where({ Id: user_id })
      .update({
        Status: status,
        UpdatedAt: governmentDb.fn.now(),
      });
  }

  async update(
    user: {
      id?: number;
      code?: string;
      email?: string | null;
      name: string | null;
      login: string | null;
      type?: string | null;
      password?: string | null;
      modules?: SystemModulesProps | null;
    },
    operation?: UserCommandOperationProps
  ): Promise<boolean> {
    let result = false;
    await governmentDb.transaction(async (trx) => {
      const userToUpdate = {
        Name: user.name,
        Login: user.login,
        UpdatedAt: governmentDb.fn.now(),
      };

      if (user.password) {
        Object.assign(userToUpdate, {
          Password: user.password,
        });
      }
      if (user.type) {
        Object.assign(userToUpdate, {
          Type: user.type,
        });
      }
      if (user.email) {
        Object.assign(userToUpdate, {
          Email: user.email,
        });
      }

      const updateUserQueryBuilder = trx("User").withSchema("users");

      if (user.id) {
        updateUserQueryBuilder.where({
          Id: user.id,
        });
      } else {
        updateUserQueryBuilder.where({
          Code: user.code,
        });

        Object.assign(userToUpdate, {
          Status: "registered",
        });
      }

      const updatedUserRows = await updateUserQueryBuilder.update(userToUpdate);

      if (user.modules) {
        for (const [_, permissions] of Object.entries(user.modules)) {
          await trx("User_Access")
            .withSchema("users")
            .where({
              Fk_User: user.id,
              Fk_Module: permissions.id,
            })
            .update({
              Read: permissions.read,
              Write: permissions.write,
            });
        }
      }

      result = updatedUserRows > 0 ? true : false;
    });

    if (operation) {
      await logsDb
        .insert({
          User_Id: operation.author,
          Resource: "user",
          Operation: "update",
          Description: operation.operation,
        })
        .withSchema("users")
        .into("Operations");
    }

    return result;
  }

  async getByEmail(
    email: string,
    status?: UserStatus,
  ): Promise<UserAccountProps | null> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .whereNull("Deleted_At")
      .where("Email", email)
      .first();

    if (status) {
      query.andWhere({
        Status: status,
      });
    }

    const result = await query;

    if (!result) {
      return null;
    }

    const {
      Id,
      Name,
      Login,
      Code,
      Status,
      Email,
      Password,
      Type,
      CreatedAt,
      UpdatedAt,
    } = result;

    const user: UserAccountProps = {
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

  async getByLogin(
    login: string,
    status?: UserStatus
  ): Promise<UserAccountProps | null> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .whereNull("Deleted_At")
      .where("Login", login)
      // .andWhere("Type", type)
      // .where((builder) => {
      //   builder
      //     .where("Type", UserTypes.ADMIN)
      //     .orWhere("Type", UserTypes.STANDARD);
      // })
      .first();

    if (status) {
      query.andWhere({
        Status: status,
      });
    }

    const result = await query;

    if (!result) {
      return null;
    }

    const {
      Id,
      Name,
      Login,
      Code,
      Status,
      Email,
      Password,
      Type,
      CreatedAt,
      UpdatedAt,
    } = result;

    const user: UserAccountProps = {
      id: Id,
      code: Code,
      status: Status,
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

  async checkIfNameAlreadyExists(name: string): Promise<boolean> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .whereNull("Deleted_At")
      .where("Name", name)
      .where((builder) => {
        builder
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      })
      .first();

    const result = await query;

    return !!result;
  }

  async deleteById(
    id_user: number,
    operation?: UserCommandOperationProps
  ): Promise<void> {

    await governmentDb("User")
      .withSchema("users")
      .where({
        Id: id_user,
      })
      .andWhere((builder) => {
        builder
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      })
      .update({
        Deleted_At: governmentDb.fn.now(),
        Code: null,
        Password: null,
        Email: null,
        Login: null
      });

    await governmentDb("User_Access")
      .withSchema("users")
      .where({
        Fk_User: id_user
      })
      .del()


    if (operation) {
      await logsDb
        .insert({
          User_Id: operation.author,
          Resource: "user",
          Operation: "delete",
          Description: operation.operation,
        })
        .withSchema("users")
        .into("Operations");
    }
  }

  async getById(id_user: number): Promise<Required<UserAccountProps> | null> {
    const result = await governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .whereNull("Deleted_At")
      .where({ Id: id_user })
      .where((builder) => {
        builder
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      })
      .first();

    if (!result) {
      return null;
    }

    const {
      Id,
      Name,
      Login,
      Code,
      Status,
      Email,
      Password,
      Type,
      CreatedAt,
      UpdatedAt,
    } = result;

    const user: Required<UserAccountProps> = {
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

  async checkIfLoginAlreadyExists(login: string): Promise<boolean> {
    const response = await governmentDb("User as u")
      .withSchema("users")
      .select(
        governmentDb.raw(
          'CASE WHEN u."Login" = ? THEN true ELSE false END AS result',
          [login]
        )
      )
      .whereNull("Deleted_At")
      .where("Login", login)
      .where((builder) => {
        builder
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      })
      .first();

    return response ? response.result : false;
  }

  async checkIfEmailAlreadyExists(email: string): Promise<boolean> {
    const user = await governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .where("Email", email)
      .whereNull("Deleted_At")
      .where((builder) => {
        builder
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      })
      .first();

    return user ? true : false;
  }
}
