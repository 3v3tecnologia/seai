import {
  governmentDb
} from "../../../../shared/infra/database/postgres/connection/knexfile";
import { UserTypes } from "../../core/model/gov-user";
import { AccountData } from "../../services/protocols/auth";

import { IAuthRepository } from "./protocol/auth.repository";

export class AuthRepository implements IAuthRepository {
  async getByEmail(email: string, type?: string): Promise<AccountData | null> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .whereNull("Deleted_At")
      .where("Email", email)
      .where("Status", 'registered')
      .first();


    if (type) {
      if (type === 'government') {
        query
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      }
      else {
        query.where("Type", type)
      }

    }

    const result = await query;

    if (!result) {
      return null;
    }

    const {
      Id,
      Name,
      Code,
      Status,
      Password,
    } = result;

    return {
      id: Id,
      name: Name,
      code: Code,
      status: Status,
      password: Password,
    };
  }
  async getByLogin(login: string, type?: string): Promise<AccountData | null> {
    const query = governmentDb
      .withSchema("users")
      .select("*")
      .from("User")
      .whereNull("Deleted_At")
      .where("Login", login)
      .where("Status", 'registered')
      .first();

    if (type) {
      if (type === 'government') {
        query
          .where("Type", UserTypes.ADMIN)
          .orWhere("Type", UserTypes.STANDARD);
      }
      else {
        query.where("Type", type)
      }
    }

    const result = await query;

    if (!result) {
      return null;
    }

    const {
      Id,
      Name,
      Code,
      Status,
      Password,
    } = result;

    return {
      id: Id,
      name: Name,
      code: Code,
      status: Status,
      password: Password,
    };
  }

}
