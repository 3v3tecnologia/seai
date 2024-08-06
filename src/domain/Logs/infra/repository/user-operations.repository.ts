import { logsDb } from "../../../../shared/infra/database/postgres/connection/knexfile";
import {
  IOutputWithPagination,
  IPaginationInput,
  toPaginatedOutput,
} from "../../../../shared/utils/pagination";
import { toDomain, UserOperation } from "../../model/user-operations";
import { UserOperationsRepositoryProtocol } from "./protocol/log-repository";

export class UserOperationsRepository
  implements UserOperationsRepositoryProtocol
{
  async getAll(
    params: {
      user_id?: number;
      resource?: string;
      operation?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<UserOperation>> {
    const query = logsDb
      .withSchema("users")
      .from("Operations")
      .innerJoin("User as u", "u.Id", "Operations.User_Id");

    if (params.user_id)
      query.where({
        User_Id: params.user_id,
      });

    if (params.resource)
      query.where({
        Resource: params.resource,
      });

    if (params.operation)
      query.where({
        Operation: params.operation,
      });

    const [rows, countResponse] = await Promise.all([
      query
        .select(
          "u.Id",
          "u.Name",
          "Operations.Time",
          "Operations.Resource",
          "Operations.Operation",
          "Operations.Description",
          "Operations.User_Id"
        )
        .limit(params.limit)
        .offset(params.offset),
      logsDb
        .withSchema("users")
        .from("Operations")
        .innerJoin("User as u", "u.Id", "Operations.User_Id")
        .count(),
    ]);

    const totalCount = Number(countResponse[0].count);

    const logs = rows.map(toDomain);

    return toPaginatedOutput({
      data: logs,
      page: params.pageNumber,
      count: totalCount,
      limit: params.limit,
    });
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
