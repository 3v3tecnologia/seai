import { governmentDb } from "../../../../../shared/infra/database/postgres/connection/knexfile";
import { UserStatus } from "../../../lib/model/status";
import {
  IrrigationUserProps,
  IrrigationUserRepositoryProtocol,
} from "./protocol/irrigation-user.repository";

export class IrrigationUserRepository
  implements IrrigationUserRepositoryProtocol
{
  async add(user: {
    code: string;
    email: string;
    login?: string;
    name?: string;
    password?: string;
  }): Promise<number | null> {
    let id_user = null;

    await governmentDb.transaction(async (trx) => {
      const toInsert = {
        Email: user.email,
        Name: user.name,
        Code: user.code,
        Status: "pending",
        Type: "irrigant",
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

      id_user = user_id;
    });

    return id_user;
  }

  async getUserByCode(code: string): Promise<IrrigationUserProps | null> {
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

    return {
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
  }
  async getUserById(id_user: number): Promise<IrrigationUserProps | null> {
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
      .where({ Id: id_user })
      .from("User")
      .first();

    if (!result) {
      return null;
    }

    const { Id, Name, Login, Code, Status, Email, Type, CreatedAt, UpdatedAt } =
      result;

    return {
      id: Id,
      name: Name,
      login: Login,
      code: Code,
      status: Status,
      email: Email,
      type: Type,
      createdAt: CreatedAt,
      updatedAt: UpdatedAt,
    };
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

  async update(user: {
    id?: number;
    code?: string;
    email?: string | null;
    name: string | null;
    login: string | null;
    password?: string | null;
  }): Promise<boolean> {
    let result = false;

    await governmentDb.transaction(async (trx) => {
      const userToUpdate = {
        Name: user.name,
        Login: user.login,
        Type: "irrigant",
        UpdatedAt: governmentDb.fn.now(),
      };

      if (user.password) {
        Object.assign(userToUpdate, {
          Password: user.password,
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

      result = updatedUserRows > 0 ? true : false;
    });
    return result;
  }

  async getByEmail(
    email: string,
    status?: UserStatus
  ): Promise<IrrigationUserProps | null> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .where("Email", email)
      .andWhere("Type", "irrigant")
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

    return {
      id: result.Id,
      name: result.Name,
      login: result.Login,
      email: result.Email,
      code: result.Code,
      status: result.Status,
      type: result.Type,
      password: result.Password,
      createdAt: result.CreatedAt,
      updatedAt: result.UpdatedAt,
    };
  }

  async getByLogin(
    login: string,
    status?: UserStatus
  ): Promise<IrrigationUserProps | null> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .where("Login", login)
      .andWhere("Type", "irrigant")
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

    return {
      id: result.Id,
      code: result.Code,
      status: result.Status,
      name: result.Name,
      login: result.Login,
      email: result.Email,
      type: result.Type,
      password: result.Password,
      createdAt: result.CreatedAt,
      updatedAt: result.UpdatedAt,
    };
  }

  async checkIfNameAlreadyExists(name: string): Promise<boolean> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .where("Name", name)
      .andWhere("Type", "irrigant")
      .first();

    const result = await query;

    return !!result;
  }

  async deleteById(id_user: number): Promise<boolean> {
    await governmentDb("User")
      .withSchema("users")
      .where("Id", id_user)
      .andWhere("Type", "irrigant")
      .del();

    return true;
  }

  async deleteByEmail(email: string): Promise<boolean> {
    await governmentDb("User")
      .withSchema("users")
      .where("Email", email)
      .andWhere("Type", "irrigant")
      .del();

    return true;
  }

  async getById(
    id_user: number
  ): Promise<Required<IrrigationUserProps> | null> {
    const result = await governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .where({ Id: id_user })
      .first();

    if (!result) {
      return null;
    }

    return {
      id: result.Id,
      name: result.Name,
      login: result.Login,
      email: result.Email,
      code: result.Code,
      status: result.Status,
      type: result.Type,
      password: result.Password,
      createdAt: result.CreatedAt,
      updatedAt: result.UpdatedAt,
    };
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
      .where("Login", login)
      .andWhere("Type", "irrigant")
      .first();

    return response ? response.result : false;
  }

  async checkIfEmailAlreadyExists(email: string): Promise<boolean> {
    const user = await governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .where("Email", email)
      .andWhere("Type", "irrigant")
      .first();

    return user ? true : false;
  }
}
