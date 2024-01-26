import {
  AccessKeyRepositoryDTO,
  AccessKeyRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/acess-key.repository";
import { DATABASES } from "../../../../shared/db/tableNames";
import { governmentDb } from "../connection/knexfile";

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

    return {
      Id: result.Id,
      Key: result.Key,
      Type: result.Type,
      Enabled: result.Enabled,
      CreatedAt: result.CreatedAt,
      UpdatedAt: result.UpdatedAt,
    };
  }
}
