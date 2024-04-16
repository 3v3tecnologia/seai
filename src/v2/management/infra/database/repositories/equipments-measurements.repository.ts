import { equipments } from "../../../../../infra/database/postgres/connection/knexfile";

export class DbEquipmentsMeasurementsRepository {
  static async getLastMeasurementsFromStation(
    idStation: number,
    date: string
  ): Promise<null | { Time: Date; Et0: number }> {
    const data = await equipments
      .select("*")
      .from("ReadStations")
      .where({ FK_Equipment: idStation })
      .andWhere({ Time: date })
      .orderBy("Time", "desc")
      .limit(1)
      .first();

    if (!data || data.Et0 === null) {
      return null;
    }

    return {
      Time: new Date(data.Time),
      Et0: data.Et0,
    };
  }

  static async getLastMeasurementsFromPluviometer(
    idPluviometer: number
  ): Promise<null | { Time: Date; Precipitation: number }> {
    const data = await equipments
      .select("FK_Equipment", "Time", "Value")
      .from("ReadPluviometers")
      .where({ FK_Equipment: idPluviometer })
      .orderBy("Time", "desc")
      .limit(1)
      .first();

    if (data) {
      return {
        Time: new Date(data.Time),
        Precipitation: data.Value,
      };
    }

    return null;
  }
}
