import { censusDb } from "../../../../../infra/database/postgres/connection/knexfile";
import { DATABASES } from "../../../../../shared/db/tableNames";

export class DbCensusCropRepository {
  static async getAllCrops(): Promise<Array<any> | any> {
    const result = await censusDb
      .select("Cultura")
      .distinct("Cultura")
      .from("CulturasIrrigadas");

    if (result.length) {
      return result.map((row: any) => row.Cultura);
    }

    return null;
  }
}
