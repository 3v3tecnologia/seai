import { CultureWeightsMapper } from "../../../src/domain/entities/management/mappers/weights";
import { ManagementWeights } from "../../../src/domain/entities/management/weights";
import { DatabaseOperationOutputLogFactory } from "../../../src/domain/use-cases/_ports/repositories/dto/output";
import {
  CultureWeightsToPersistency,
  ManagementWeightsRepositoryDTO,
  ManagementWeightsRepositoryProtocol,
} from "../../../src/domain/use-cases/_ports/repositories/management-weights.repository";
import { withPagination } from "../../../src/infra/database/postgres/repositories/mapper/WithPagination";
import { DATABASES } from "../../../src/shared/db/tableNames";

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
      this.data.findIndex((weight) => weight.Id_Basin === request.Id_Basin),
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

    weights.forEach((farmWeight) => {
      const indicators = [
        ...farmWeight.Productivity,
        ...farmWeight.Profitability,
        ...farmWeight.WaterConsumption,
        ...farmWeight.Jobs,
      ];

      const R = indicators.reduce((prev, current) => {
        if (current.Value) {
          return (prev += current.Value);
        }

        return 0;
      }, 0) / indicators.length;

      farmWeight.WaterCut = (R - 1) * 100;
      farmWeight.R = (R - 1) * 100;

    });

    return withPagination(weights, {
      count: weights.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
