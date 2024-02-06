import { ManagementStudyMapper } from "../../../../domain/entities/management/mappers/study";
import { DatabaseOperationOutputLogFactory } from "../../../../domain/use-cases/_ports/repositories/dto/output";
import {
  ManagementStudiesRepositoryDTO,
  ManagementStudiesRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/management-studies.repository";
import { DATABASES } from "../../../../shared/db/tableNames";
import { managementDb } from "../connection/knexfile";
import { withPagination } from "./mapper/WithPagination";

export class DbManagementStudiesRepository
  implements ManagementStudiesRepositoryProtocol
{
  async create(
    request: ManagementStudiesRepositoryDTO.Create.Request
  ): ManagementStudiesRepositoryDTO.Create.Response {
    const toPersistency = request.map((data) =>
      ManagementStudyMapper.toPersistency(data)
    );

    const result = await managementDb
      .batchInsert(DATABASES.MANAGEMENT.TABLES.STUDIES, toPersistency)
      .returning("Id_Basin");

    console.log("[ManagementStudiesRepository] :: RESULT ", result);

    return DatabaseOperationOutputLogFactory.insert(
      DATABASES.MANAGEMENT.TABLES.STUDIES
    );
  }

  async delete(
    request: ManagementStudiesRepositoryDTO.Delete.Request
  ): ManagementStudiesRepositoryDTO.Delete.Response {
    await managementDb(DATABASES.MANAGEMENT.TABLES.STUDIES)
      .where("Id_Basin", request.Id_Basin)
      .del();

    return DatabaseOperationOutputLogFactory.delete(
      DATABASES.MANAGEMENT.TABLES.STUDIES
    );
  }

  async getByBasin(
    request: ManagementStudiesRepositoryDTO.GetByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetByBasin.Response {
    const result = await managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.STUDIES)
      .where({
        Id_Basin: request.Id_Basin,
      })
      .limit(request.limit)
      .offset(request.pageNumber);

    console.log("[ManagementStudiesRepository] :: RESULT ", result);

    if (!result.length) {
      return null;
    }

    const data = result.map((row: any) => ManagementStudyMapper.toDomain(row));

    return withPagination(data, {
      count: result.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
