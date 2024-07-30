import { logsDb } from "../../../infra/database/postgres/connection/knexfile";
import { toDomain, UserOperation } from "../model/user-operations";
import { UserOperationsRepositoryProtocol } from "./protocol/log-repository";

export class UserOperationsRepository
  implements UserOperationsRepositoryProtocol
{
  async save({
    user_id,
    description,
    operation,
    resource,
  }: {
    user_id: number;
    resource: string;
    operation: string;
    description: string;
  }): Promise<void> {
    return await logsDb
      .insert({
        User_Id: user_id,
        Resource: resource,
        Operation: operation,
        Description: description,
      })
      .withSchema("users")
      .into("Operations");
  }

  async getAll(params: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<Array<UserOperation> | null> {
    const result = await logsDb
      .withSchema("users")
      .select(
        "u.Id",
        "u.Name",
        "Operations.Time",
        "Operations.Resource",
        "Operations.Operation",
        "Operations.Description"
      )
      .from("Operations")
      .innerJoin('users."User" as u', "u.Id", "Operations.User_Id");

    return result.map(toDomain);
  }

  async getById(id: number): Promise<UserOperation | null> {
    const result = await logsDb
      .withSchema("users")
      .select(
        "u.Id",
        "u.Name",
        "Operations.Time",
        "Operations.Resource",
        "Operations.Operation",
        "Operations.Description"
      )
      .from("Operations")
      .where({
        Id: id,
      })
      .innerJoin('users."User" as u', "u.Id", "Operations.User_Id")
      .first();

    if (result) {
      return toDomain(result);
    }

    return null;
  }
}
