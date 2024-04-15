import { DatabaseOperationOutputLogFactory } from "../../../../../domain/use-cases/_ports/repositories/dto/output";
import { DATABASES } from "../../../../../shared/db/tableNames";
import { CultureWeightsMapper } from "../../../entities/mappers/weights";
import { ManagementWeightsRepositoryDTO } from "../../../ports/weights/repository";
import { managementDb } from "../connections/db";

export class DbManagementWeightsRepository {
  static async create(
    id: number,
    weights: Array<any>
  ): ManagementWeightsRepositoryDTO.Create.Response {
    const toPersistency = weights.map((data) => {
      return {
        Id_Basin: id,
        Crop: data.Crop,
        ProductivityPerHectare: data.ProductivityPerHectare,
        ProductivityPerMeters: data.ProductivityPerMeters,
        ProfitabilityPerMeters: data.ProfitabilityPerMeters,
        ProfitabilityPerHectare: data.ProfitabilityPerHectare,
        JobsPerHectare: data.JobsPerHectare,
        JobsPerMeters: data.JobsPerMeters,
        WaterConsumption: data.WaterConsumption,
      };
    });

    const result = await managementDb
      .batchInsert(DATABASES.MANAGEMENT.TABLES.WEIGHTS, toPersistency)
      .returning("Id_Basin");

    console.log("[ManagementWeightsRepository] :: RESULT ", result);

    return DatabaseOperationOutputLogFactory.insert(
      DATABASES.MANAGEMENT.TABLES.WEIGHTS
    );
  }

  static async delete(
    request: ManagementWeightsRepositoryDTO.Delete.Request
  ): ManagementWeightsRepositoryDTO.Delete.Response {
    const result = await managementDb(DATABASES.MANAGEMENT.TABLES.WEIGHTS)
      .where({
        Id_Basin: request.id_basin,
      })
      .del();

    console.log("[ManagementWeightsRepository] :: RESULT ", result);

    return DatabaseOperationOutputLogFactory.delete(
      DATABASES.MANAGEMENT.TABLES.WEIGHTS
    );
  }

  static async getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    const query = managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.WEIGHTS)
      .where({
        Id_Basin: request.id_basin,
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
