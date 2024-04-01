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

  async getAllByBasin(
    request: ManagementStudiesRepositoryDTO.GetAllByBasin.Request
  ): ManagementStudiesRepositoryDTO.GetAllByBasin.Response {
    const raw = await managementDb.raw(
      `
      SELECT
              s."Culture",
             s."Id_Basin" ,
              c."Name" AS "Culture",
              s."Harvest" ,
              s."Farm" ,
             s."ProductivityPerKilo" ,
             s."ProductivityPerMeters"
      FROM
                    "Studies" s
      INNER JOIN "Crop" c
              ON
                  c."Name" = s."Culture"
      WHERE
          s."Id_Basin" = ?
      `,
      [request.Id_Basin]
    );

    if (!raw.rows.length) {
      return null;
    }

    const result: Map<
      string,
      {
        Id_Basin: number;
        Culture: number;
        Harvest: number;
        Farm: number;
        ProductivityPerKilo: number | null;
        ProductivityPerMeters: number | null;
      }
    > = new Map();

    raw.rows.forEach((raw: any) => {
      const culture = {
        Id_Basin: raw.Id_Basin,
        Culture: raw.Culture,
        Harvest: raw.Harvest, //safra
        Farm: raw.Farm, // cultivo
        ProductivityPerKilo: raw.ProductivityPerKilo,
        ProductivityPerMeters: raw.ProductivityPerMeters,
      };

      const name = raw.Culture;

      // if (result.has(name)) {
      //   result.get(name)?.Cultures.push(culture);

      //   return;
      // }

      result.set(name, culture);
    });

    return result;
  }
}
