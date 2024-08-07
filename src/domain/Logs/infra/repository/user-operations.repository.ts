import { Knex } from "knex";
import { logsDb } from "../../../../shared/infra/database/postgres/connection/knexfile";
import {
  IOutputWithPagination,
  IPaginationInput,
  toPaginatedOutput,
} from "../../../../shared/utils/pagination";
import { toDomain, UserOperation } from "../../model/user-operations";
import { UserOperationsRepositoryProtocol } from "./protocol/log-repository";

async function getPaginatedResult(
  query: Knex.QueryBuilder,
  limit: number,
  offset: number
) {
  const count = query.clone().count().clearSelect();
  const [rows, countResponse] = await Promise.all([
    query.limit(limit).offset(offset),
    count,
  ]);

  return {
    rows,
    count: countResponse.length,
  };
}
export class UserOperationsRepository
  implements UserOperationsRepositoryProtocol
{
  async getAll(
    params: {
      user_id?: number;
      resource?: string;
      operation?: string;
      start_date?: string;
      end_date?: string;
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

    if (params.start_date)
      query.whereRaw('"Operations"."Time"::date >= ?', params.start_date);

    if (params.end_date)
      query.whereRaw('"Operations"."Time"::date <= ?', params.end_date);

    const { count, rows } = await getPaginatedResult(
      query.select(
        "u.Id",
        "u.Name",
        "Operations.Time",
        "Operations.Resource",
        "Operations.Operation",
        "Operations.Description",
        "Operations.User_Id"
      ),
      params.limit,
      params.offset
    );

    const logs = rows.map(toDomain);

    return toPaginatedOutput({
      data: logs,
      page: params.pageNumber,
      count,
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
