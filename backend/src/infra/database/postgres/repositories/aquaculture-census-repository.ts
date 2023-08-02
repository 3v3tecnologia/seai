import { censusDb } from "../connection/knexfile";

export class KnexAquacultureCensusRepository {
  async getByBasin(): Promise<void | null> {
    const data = await censusDb.raw(`
  `);

    if (!data.rowCount) {
      return null;
    }

    console.log("data ::: ", data.rows);
  }
  async getByCounty(): Promise<void | null> {}
}
