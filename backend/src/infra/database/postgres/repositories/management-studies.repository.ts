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
    const toPersistency = request.Data.map((data) => {
      return {
        Id_Basin: request.Id_Basin,
        Id_Culture: data.Id_Culture,
        Harvest: data.Harvest,
        Farm: data.Farm,
        ProductivityPerKilo: data.Productivity[0],
        ProductivityPerMeters: data.Productivity[1],
      };
    });
    const result = await managementDb
      .batchInsert(DATABASES.MANAGEMENT.TABLES.STUDIES, toPersistency)
      .returning("Id_Basin");

    console.log("[ManagementStudiesRepository] :: RESULT ", result);
  }

  async delete(
    request: ManagementStudiesRepositoryDTO.Delete.Request
  ): ManagementStudiesRepositoryDTO.Delete.Response {
    await managementDb(DATABASES.MANAGEMENT.TABLES.STUDIES)
      .where("Id_Basin", request.Id_Basin)
      .del();
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

    const data = result.map((row: any) => {
      return {
        Id_Basin: Number(row.Id_Basin),
        Id_Culture: Number(row.Id_Culture),
        Harvest: Number(row.Harvest),
        Farm: Number(row.Farm),
        Productivity: [
          {
            Value: Number(row.ProductivityPerKilo),
            Unity: "kg/ha",
          },
          {
            Value: Number(row.ProductivityPerMeters),
            Unity: "m³/ha",
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
