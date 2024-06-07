import { PluviometerMeasurementsToPersist, StationMeasurementsToPersist } from "../services/measurements";
import { equipmentsDb } from "./utils/connection";

export class DbEquipmentsMeasurementsRepository {
  static async getLastMeasurementsFromStation(
    idStation: number,
    date: string
  ): Promise<null | { Time: Date; Et0: number }> {
    const data = await equipmentsDb
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
    const data = await equipmentsDb
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

  static async insertStations(measurements: Array<any>): Promise<Array<number>> {
    let ids: Array<number> = [];

    await equipmentsDb.transaction(async (trx) => {
      ids = await trx.batchInsert<any>(
        "ReadStations",
        measurements.map((item: any) => {
          return {
            FK_Equipment: item.FK_Equipment,
            FK_Organ: item.FK_Organ,
            Time: item.Time,
            Hour: item.Hour,
            TotalRadiation: item.TotalRadiation,
            MaxRelativeHumidity: item.MaxRelativeHumidity,
            MinRelativeHumidity: item.MinRelativeHumidity,
            AverageRelativeHumidity: item.AverageRelativeHumidity,
            MaxAtmosphericTemperature: item.MaxAtmosphericTemperature,
            MinAtmosphericTemperature: item.MinAtmosphericTemperature,
            AverageAtmosphericTemperature:
              item.AverageAtmosphericTemperature,
            AtmosphericPressure: item.AtmosphericPressure,
            WindVelocity: item.WindVelocity,
            Et0: item.Et0 || null,
          };
        })
        //@ts-ignore
      ).returning("IdRead");
    });

    return ids
  }

  static async bulkInsert(measurements: Array<StationMeasurementsToPersist | PluviometerMeasurementsToPersist>, type: 'station' | 'pluviometer') {
    let ids: Array<number> = [];

    switch (type) {
      case "station":

        await equipmentsDb.transaction(async (trx) => {
          ids = await trx.batchInsert<any>(
            "ReadStations",
            measurements.map((item: any) => {
              return {
                FK_Equipment: item.FK_Equipment,
                FK_Organ: item.FK_Organ,
                Time: item.Time,
                Hour: item.Hour,
                TotalRadiation: item.TotalRadiation,
                MaxRelativeHumidity: item.MaxRelativeHumidity,
                MinRelativeHumidity: item.MinRelativeHumidity,
                AverageRelativeHumidity: item.AverageRelativeHumidity,
                MaxAtmosphericTemperature: item.MaxAtmosphericTemperature,
                MinAtmosphericTemperature: item.MinAtmosphericTemperature,
                AverageAtmosphericTemperature:
                  item.AverageAtmosphericTemperature,
                AtmosphericPressure: item.AtmosphericPressure,
                WindVelocity: item.WindVelocity,
                Et0: item.Et0 || null,
              };
            })
          ).returning("IdRead");
        });

        return ids

      case "pluviometer":
        await equipmentsDb.transaction(async (trx) => {
          await trx.batchInsert(
            "ReadPluviometers",
            measurements.map((eqp: any) => {
              return {
                FK_Equipment: eqp.FK_Equipment,
                FK_Organ: eqp.FK_Organ,
                Time: eqp.Time,
                Hour: eqp.Hour,
                Value: eqp.Pluviometry,
              };
            })
          );
        });
        break
      default:
        throw new Error("Necessário informar um tipo de equipamento válido")
    }

    return ids
  }

  static async bulkUpdate(measurements: Array<any>, type: 'station' | 'pluviometer'): Promise<void> {
    try {
      switch (type) {
        case "station":
          await updateStationsMeasurements(measurements)
          break
        case "pluviometer":
          await updatePluviometerMeasurements(measurements)
          break
      }

      console.log("Sucesso ao atualizar medições");
    } catch (error) {
      console.error("Error during batch update:", error);
      throw error
    }
  }

  static async getStationCodesWithMeasurements(equipmentsCodes: Array<string>, time: string): Promise<Array<string>> {
    const result = await equipmentsDb
      .select("MetereologicalEquipment.IdEquipmentExternal")
      .from("ReadStations")
      .innerJoin(
        "MetereologicalEquipment",
        "MetereologicalEquipment.IdEquipment",
        "ReadStations.FK_Equipment"
      )
      .whereIn("IdEquipmentExternal", equipmentsCodes)
      .andWhere({ Time: time });

    const equipmentsWithMeasures: Array<string> = [];

    if (result.length) {
      result.forEach((eqp: any) => {
        const { IdEquipmentExternal } = eqp;

        equipmentsWithMeasures.push(IdEquipmentExternal);
      });
    }

    return equipmentsWithMeasures;
  }
  static async getPluviometersCodesWithMeasurements(equipmentsCodes: Array<string>, time: string): Promise<Array<string>> {
    const result = await equipmentsDb
      .select("MetereologicalEquipment.IdEquipmentExternal")
      .from("ReadPluviometers")
      .innerJoin(
        "MetereologicalEquipment",
        "MetereologicalEquipment.IdEquipment",
        "ReadPluviometers.FK_Equipment"
      )
      .whereIn("IdEquipmentExternal", equipmentsCodes)
      .andWhere({ Time: time });

    const equipmentsWithMeasures: Array<string> = [];

    if (result.length) {
      result.forEach((eqp: any) => {
        const { IdEquipmentExternal } = eqp;

        equipmentsWithMeasures.push(IdEquipmentExternal);
      });
    }

    return equipmentsWithMeasures;
  }

  static async getMeasurementsIdsByTime(time: string, type: 'station' | 'pluviometer', id_organ: number): Promise<Map<number, number>> {
    const sqlQuery = equipmentsDb
      .select("IdRead", "FK_Equipment")
      .where({ Time: time })
      .andWhere({ FK_Organ: id_organ })

    switch (type) {
      case "station":
        sqlQuery.from("ReadStations")
        break;
      case "pluviometer":
        sqlQuery.from("ReadPluviometers")
        break;
      default:
        throw new Error("Necessário informar um tipo de equipamento válido")
    }

    const response = await sqlQuery

    const ids: Map<number, number> = new Map();

    if (response.length) {
      response.forEach((m: any) => {
        const { IdRead, FK_Equipment } = m;

        ids.set(FK_Equipment, IdRead)
      });
    }

    return ids;
  }
}

async function updateStationsMeasurements(measurements: Array<StationMeasurementsToPersist>): Promise<Array<number>> {
  let updatedIds: number[] = []

  await equipmentsDb.transaction(async (trx) => {
    const tempTableName = "Temp_ReadStations";

    // Create a temporary table
    await trx.raw(`
        CREATE TABLE "${tempTableName}" (
        "IdRead" INT GENERATED ALWAYS AS IDENTITY,
        "Time" DATE NOT NULL,
        "Hour" SMALLINT DEFAULT NULL,
        "TotalRadiation" REAL DEFAULT NULL,
        "MaxRelativeHumidity" REAL DEFAULT NULL,
        "MinRelativeHumidity" REAL DEFAULT NULL,
        "AverageRelativeHumidity" REAL DEFAULT NULL,
        "MaxAtmosphericTemperature" REAL DEFAULT NULL,
        "MinAtmosphericTemperature" REAL DEFAULT NULL,
        "AverageAtmosphericTemperature" REAL DEFAULT NULL,
        "AtmosphericPressure" REAL DEFAULT NULL,
        "WindVelocity" REAL DEFAULT NULL,
        "Et0" REAL DEFAULT NULL,
        "FK_Organ" INT,
        "FK_Equipment" INT,
        PRIMARY KEY("IdRead")
        );
      `);

    const toPersistency = measurements.map((measures: any) => {
      return {
        FK_Equipment: measures.FK_Equipment,
        FK_Organ: measures.FK_Organ,
        Time: measures.Time,
        Hour: measures.Hour,
        TotalRadiation: measures.TotalRadiation,
        MaxRelativeHumidity: measures.MaxRelativeHumidity,
        MinRelativeHumidity: measures.MinRelativeHumidity,
        AverageRelativeHumidity: measures.AverageRelativeHumidity,
        MaxAtmosphericTemperature: measures.MaxAtmosphericTemperature,
        MinAtmosphericTemperature: measures.MinAtmosphericTemperature,
        AverageAtmosphericTemperature:
          measures.AverageAtmosphericTemperature,
        AtmosphericPressure: measures.AtmosphericPressure,
        WindVelocity: measures.WindVelocity,
        Et0: measures.Et0,
      };
    });

    // Insert new data into the temporary table
    await trx(tempTableName).insert(toPersistency);

    updatedIds = await trx.select("IdRead").from(tempTableName);

    // Perform the batch update
    await trx.raw(`
        UPDATE "ReadStations" AS rs
        SET
          "FK_Equipment" =  t."FK_Equipment",
          "FK_Organ" = t."FK_Organ",
          "Time" = t."Time",
          "Hour" = t."Hour",
          "TotalRadiation" = t."TotalRadiation",
          "MaxRelativeHumidity" = t."MaxRelativeHumidity",
          "MinRelativeHumidity" = t."MinRelativeHumidity",
          "AverageRelativeHumidity" = t."AverageRelativeHumidity",
          "MaxAtmosphericTemperature" = t."MaxAtmosphericTemperature",
          "MinAtmosphericTemperature" = t."MinAtmosphericTemperature",
          "AverageAtmosphericTemperature" = t."AverageAtmosphericTemperature",
          "AtmosphericPressure" = t."AtmosphericPressure",
          "WindVelocity" = t."WindVelocity",
          "Et0" = t."Et0"
        FROM "${tempTableName}" AS t
        WHERE rs."FK_Equipment" = t."FK_Equipment" and rs."Time" = t."Time";
    `);

    // Clean up the temporary table
    await trx.raw(`DROP TABLE "${tempTableName}"`)

  });

  return updatedIds

}
async function updatePluviometerMeasurements(measurements: Array<PluviometerMeasurementsToPersist>) {
  await equipmentsDb.transaction(async (trx) => {
    const tempTableName = "Temp_ReadPluviometers";

    // Create a temporary table
    await trx.raw(`
        CREATE TABLE "${tempTableName}" (
          "IdRead" INT GENERATED ALWAYS AS IDENTITY,
          "Value" REAL,
          "Time" DATE NOT NULL,
          "Hour" SMALLINT DEFAULT NULL,
          "FK_Organ" INT,
          "FK_Equipment" INT,
          PRIMARY KEY("IdRead")
        );
      `);

    const toPersistency = measurements.map((eqp: any) => {
      return {
        FK_Equipment: eqp.FK_Equipment,
        FK_Organ: eqp.FK_Organ,
        Time: eqp.Time,
        Hour: eqp.Hour,
        Value: eqp.Value,
      };
    });

    // Insert new data into the temporary table
    await trx(tempTableName).insert(toPersistency);

    // Perform the batch update
    await trx.raw(`
        UPDATE "ReadPluviometers" AS rp
        SET
          "FK_Equipment" = t."FK_Equipment",
          "FK_Organ" = t."FK_Organ",
          "Time" = t."Time",
          "Hour" = t."Hour",
          "Value" = t."Value"
        FROM "${tempTableName}" AS t
        WHERE rp."FK_Equipment" = t."FK_Equipment" AND rp."Time" = t."Time";
    `);

    // Clean up the temporary table
    // await trx.dropTable(tempTableName);
    await trx.raw(`DROP TABLE "${tempTableName}"`)
  });
}
