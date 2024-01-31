import { ApiKeyMapper } from "../../../../domain/entities/apiKey/mapper/api-key-mapper";
import {
  AccessKeyRepositoryDTO,
  AccessKeyRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/acess-key.repository";
import { DATABASES } from "../../../../shared/db/tableNames";
import { governmentDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbAccessKeyRepository implements AccessKeyRepositoryProtocol {
  async create(
    request: AccessKeyRepositoryDTO.Create.Request
  ): AccessKeyRepositoryDTO.Create.Response {
    const result = await governmentDb
      .insert({
        Key: request.Key,
        Type: request.Type,
        Enabled: request.Enabled,
        UpdatedAt: governmentDb.fn.now(),
        CreatedAt: governmentDb.fn.now(),
      })
      .returning("Id")
      .into(DATABASES.API_KEY);

    const id = result.length && result[0].Id;

    return id;
  }

  async update(
    request: AccessKeyRepositoryDTO.Update.Request
  ): AccessKeyRepositoryDTO.Update.Response {
    await governmentDb(DATABASES.API_KEY)
      .where({
        Id: request.Id,
      })
      .update({
        Key: request.Key,
        Type: request.Type,
        Enabled: request.Enabled,
        UpdatedAt: governmentDb.fn.now(),
      });
  }

  async delete(
    request: AccessKeyRepositoryDTO.Update.Request
  ): AccessKeyRepositoryDTO.Update.Response {
    await governmentDb(DATABASES.API_KEY)
      .where({
        Id: request.Id,
      })
      .del();
  }

  async getById(
    request: AccessKeyRepositoryDTO.GetById.Request
  ): AccessKeyRepositoryDTO.GetById.Response {
    const result = await governmentDb(DATABASES.API_KEY)
      .select("*")
      .where({
        Id: request.Id,
      })
      .first();

    if (!result) {
      return null;
    }

    return ApiKeyMapper.toDomain(result);
  }

  async getAll(
    request: AccessKeyRepositoryDTO.GetAll.Request
  ): AccessKeyRepositoryDTO.GetAll.Response {
    const result = await governmentDb.raw(`
      SELECT 
          "Id", "Key", "Type", "Enabled", "CreatedAt", "UpdatedAt" 
      FROM "${DATABASES.API_KEY}" 
      LIMIT ${request.limit} OFFSET  ${request.pageNumber}
    `);

    if (result.rows.length === 0) {
      return null;
    }
    const data = result.rows.map((row: any) => ApiKeyMapper.toDomain(row));

    return withPagination(data, {
      count: result.rows.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }

  async getByKey(
    request: AccessKeyRepositoryDTO.GetByKey.Request
  ): AccessKeyRepositoryDTO.GetByKey.Response {
    const result = await governmentDb(DATABASES.API_KEY)
      .select("*")
      .where({
        Key: request.Key,
      })
      .first();

    if (!result) {
      return null;
    }

    return ApiKeyMapper.toDomain(result);
  }
}
