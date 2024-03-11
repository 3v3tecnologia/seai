import { DatabaseOperationOutputLogFactory } from "../../../src/domain/use-cases/_ports/repositories/dto/output";
import { withPagination } from "../../../src/infra/database/postgres/repositories/mapper/WithPagination";
import { DATABASES } from "../../../src/shared/db/tableNames";
import { CultureWeightsMapper } from "../../../src/v2/management/entities/mappers/weights";
import {
  CultureWeightsToPersistency,
  ManagementWeightsRepositoryDTO,
  ManagementWeightsRepositoryProtocol,
} from "../../../src/v2/management/ports/weights/repository";

export class InMemoryManagementWeightsRepository
  implements ManagementWeightsRepositoryProtocol
{
  private data: Array<CultureWeightsToPersistency> = [];

  async create(
    request: ManagementWeightsRepositoryDTO.Create.Request
  ): ManagementWeightsRepositoryDTO.Create.Response {
    const toPersistency = CultureWeightsMapper.toPersistency(request);
    this.data = this.data.concat(toPersistency);
    return DatabaseOperationOutputLogFactory.insert(
      DATABASES.MANAGEMENT.TABLES.WEIGHTS
    );
  }
  async delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response {
    this.data.splice(
      this.data.findIndex((weight) => weight.Id_Basin === request.id_basin),
      1
    );

    return DatabaseOperationOutputLogFactory.delete(
      DATABASES.MANAGEMENT.TABLES.WEIGHTS
    );
  }
  async getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    const weights = this.data.map((row: any) =>
      CultureWeightsMapper.toDomain(row)
    );

    return weights;
  }
}
