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
    const toPersistency = request.Data.map((data) => {
      return {
        Id_Basin: request.Id_Basin,
        Id_Culture: data.Id_Culture,
        ProductivityPerKilo: data.Productivity[0],
        ProductivityPerMeters: data.Productivity[1],
        ProfitabilityPerHectare: data.Profitability[0],
        ProfitabilityPerMeters: data.Profitability[1],
        JobsPerMeters: data.Jobs[0],
        JobsPerHectare: data.Jobs[1],
        WaterConsumptionPerHectare: data.WaterConsumption[0],
        WaterConsumptionPerMeters: data.WaterConsumption[1],
      };
    });

    const result = await managementDb
      .batchInsert(DATABASES.MANAGEMENT.TABLES.WEIGHTS, toPersistency)
      .returning("Id_Basin");

    console.log("[ManagementWeightsRepository] :: RESULT ", result);
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
  }

  async getByBasin(
    request: ManagementWeightsRepositoryDTO.GetByBasin.Request
  ): ManagementWeightsRepositoryDTO.GetByBasin.Response {
    const result = await managementDb
      .select("*")
      .from(DATABASES.MANAGEMENT.TABLES.WEIGHTS)
      .where({
        Id_Basin: request.Id_Basin,
      })
      .limit(request.limit)
      .offset(
        request.pageNumber ? request.limit * (request.pageNumber - 1) : 0
      );

    if (!result.length) {
      return null;
    }

    // Add mapper
    const data = result.map((row: any) => {
      return {
        Id_Basin: Number(row.Id_Basin),
        Id_Culture: Number(row.Id_Culture),
        Productivity: [
          {
            Value: Number(row.ProductivityPerKilo) || null,
            Unity: "Kg/ha",
          },
          {
            Value: Number(row.ProductivityPerMeters) || null,
            Unity: "kg/m³",
          },
        ],
        Profitability: [
          {
            Value: Number(row.ProfitabilityPerHectare) || null,
            Unity: "R$/ha",
          },
          {
            Value: Number(row.ProfitabilityPerMeters) || null,
            Unity: "R$/m³",
          },
        ],
        Jobs: [
          {
            Value: Number(row.JobsPerMeters) || null,
            Unity: "1000m³",
          },
          {
            Value: Number(row.JobsPerHectare) || null,
            Unity: "ha",
          },
        ],
        WaterConsumption: [
          {
            Value: Number(row.WaterConsumptionPerMeters) || null,
            Unity: "m",
          },
          {
            Value: Number(row.WaterConsumptionPerHectare) || null,
            Unity: "ha",
          },
        ],
      };
    });

    return withPagination(data, {
      count: result.length,
      limit: request.limit,
      offset: request.pageNumber,
    });
  }
}
