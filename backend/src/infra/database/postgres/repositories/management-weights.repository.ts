import { CultureWeightsMapper } from "../../../../domain/entities/management/mappers/weights";
import { DatabaseOperationOutputLogFactory } from "../../../../domain/use-cases/_ports/repositories/dto/output";
import {
  ManagementWeightsRepositoryDTO,
  ManagementWeightsRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/management-weights.repository";
import { DATABASES } from "../../../../shared/db/tableNames";
import { managementDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbManagementWeightsRepository
  implements ManagementWeightsRepositoryProtocol
{
  async create(
    request: ManagementWeightsRepositoryDTO.Create.Request
  ): ManagementWeightsRepositoryDTO.Create.Response {
    const toPersistency = CultureWeightsMapper.toPersistency(request);

    const result = await managementDb
      .batchInsert(DATABASES.MANAGEMENT.TABLES.WEIGHTS, toPersistency)
      .returning("Id_Basin");

    console.log("[ManagementWeightsRepository] :: RESULT ", result);

    return DatabaseOperationOutputLogFactory.insert(
      DATABASES.MANAGEMENT.TABLES.WEIGHTS
    );
  }

  async delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response {
    const result = await managementDb(DATABASES.MANAGEMENT.TABLES.WEIGHTS)
      .where({
        Id_Basin: request.Id_Basin,
      })
      .del();

    console.log("[ManagementWeightsRepository] :: RESULT ", result);

    return DatabaseOperationOutputLogFactory.delete(
      DATABASES.MANAGEMENT.TABLES.WEIGHTS
    );
  }

  async getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    const query = managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.WEIGHTS)
      .where({
        Id_Basin: request.Id_Basin,
      });

    if (request.limit && request.pageNumber) {
      query.limit(request.limit).offset(request.pageNumber);
    }

    const result = await query;

    if (!result.length) {
      return null;
    }

    const weights = result.map((row: any) =>
      CultureWeightsMapper.toDomain(row)
    );

    return weights;
  }
}
