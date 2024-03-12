import { Knex } from "knex";
import {
  DatabaseOperationOutputLog,
  DatabaseOperationOutputLogFactory,
} from "../../../../../domain/use-cases/_ports/repositories/dto/output";
import { DATABASES } from "../../../../../shared/db/tableNames";
import { CensusStudyMapper } from "../../../entities/mappers/study";
import { CensusStudy } from "../../../entities/study";
import { managementDb } from "../connections/db";

export class DbManagementStudiesRepository {
  static async create(
    request: Array<CensusStudy>,
    id: number
  ): Promise<DatabaseOperationOutputLog | null> {
    const toPersistency = request.map((data) =>
      CensusStudyMapper.toPersistency(data, id)
    );

    await managementDb
      .batchInsert(DATABASES.MANAGEMENT.TABLES.STUDIES, toPersistency)
      .returning("Id_Basin");

    return DatabaseOperationOutputLogFactory.insert(
      DATABASES.MANAGEMENT.TABLES.STUDIES
    );
  }

  static async delete(id: number): Promise<DatabaseOperationOutputLog> {
    await managementDb(DATABASES.MANAGEMENT.TABLES.STUDIES)
      .where("Id_Basin", id)
      .del();

    return DatabaseOperationOutputLogFactory.delete(
      DATABASES.MANAGEMENT.TABLES.STUDIES
    );
  }

  static async getByBasin(
    id: number
  ): Promise<Map<string, Omit<CensusStudy, "Crop">> | null> {
    const raw = await managementDb
      .select(
        "Id_Basin",
        "Crop",
        "HarvestDuration",
        "CultivationPeriod",
        "Consumption",
        "Productivity"
      )
      .where({
        Id_Basin: id,
      })
      .from(DATABASES.MANAGEMENT.TABLES.STUDIES);

    if (raw.length) {
      const result = new Map<string, Omit<CensusStudy, "Crop">>();

      raw.forEach((row: any) => {
        result.set(row.Crop, {
          HarvestDuration: Number(row.HarvestDuration),
          CultivationPeriod: Number(row.CultivationPeriod),
          Consumption: Number(row.Consumption),
          Productivity: Number(row.Productivity),
        });
      });

      return result;
    }

    return null;
  }
}
