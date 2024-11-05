import {
  governmentDb,
  logsDb,
} from "../../../../shared/infra/database/postgres/connection/knexfile";
import { countTotalRows } from "../../../../shared/infra/database/postgres/paginate";
import { toPaginatedOutput } from "../../../../shared/utils/pagination";

import { UserCommandOperationProps } from "../../../Logs/core/protocols/logger";
import { PluviometerReadEntity } from "../../core/models/PluviometerRead";
import { StationReadEntity } from "../../core/models/StationRead";
import {
  IEquipmentsMeasurementsRepository,
  IEquipsMeasurementsRepoDTO,
  PluviometerMeasurementsToPersist,
  StationMeasurementsToPersist,
} from "./protocols/measurements";

function mapStationMeasurementsWithUnitsToDomain(row: any): StationReadEntity {
  return {
    IdRead: Number(row.IdRead) || null,
    IdEquipment: Number(row.IdEquipment),
    Time: row.Date,
    Hour: row.Hour,
    Altitude: {
      Unit: "m",
      Value: Number(row.Altitude) || null,
    },
    TotalRadiation: {
      Unit: "W/m",
      Value: Number(row.TotalRadiation) || null,
    },
    AverageRelativeHumidity: {
      Unit: "%",
      Value: Number(row.AverageRelativeHumidity) || null,
    },
    MinRelativeHumidity: {
      Unit: "%",
      Value: Number(row.MinRelativeHumidity) || null,
    },
    MaxRelativeHumidity: {
      Unit: "%",
      Value: Number(row.MaxRelativeHumidity) || null,
    },
    AverageAtmosphericTemperature: {
      Unit: "ºC",
      Value: Number(row.AverageAtmosphericTemperature) || null,
    },
    MaxAtmosphericTemperature: {
      Unit: "ºC",
      Value: Number(row.MaxAtmosphericTemperature) || null,
    },
    MinAtmosphericTemperature: {
      Unit: "ºC",
      Value: Number(row.MinAtmosphericTemperature) || null,
    },
    AtmosphericPressure: {
      Unit: "hPa",
      Value: Number(row.AtmosphericPressure) || null,
    },
    WindVelocity: {
      Unit: "m/s",
      Value: Number(row.WindVelocity) || null,
    },
    Et0: {
      Unit: "mm",
      Value: Number(row.Et0) || null,
    },
  };
}

function mapPluviometerMeasurementsWithUnitsToDomain(
  row: any
): PluviometerReadEntity {
  const data = {
    IdRead: Number(row.IdRead) || null,
    Time: row.Time,
    Hour: row.Hour,
    Precipitation: {
      Unit: "mm",
      Value: Number(row.Value) || null,
    },
  };

  if (Reflect.has(row, "IdEquipment")) {
    Object.assign(data, {
      IdEquipment: row.IdEquipment,
    });
  }

  return data;
}

export class EquipmentsMeasurementsRepository
  implements IEquipmentsMeasurementsRepository {
  async checkIfStationMeasureTimeAlreadyExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfStationMeasureTimeAlreadyExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfStationMeasureTimeAlreadyExists.Result {
    const measure = await governmentDb
      .withSchema("equipments")
      .select("IdRead")
      .from("ReadStations")
      .where({ Time: params.time })
      .andWhereNot({ IdRead: params.idRead })
      .first();

    if (!measure) {
      return false;
    }

    return measure.IdRead >= 0;
  }
  async checkIfPluviometerMeasureTimeAlreadyExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfPluviometerMeasureTimeAlreadyExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfPluviometerMeasureTimeAlreadyExists.Result {
    const measure = await governmentDb
      .withSchema("equipments")
      .select("IdRead")
      .from("ReadPluviometers")
      .where({ Time: params.time })
      .andWhereNot({ IdRead: params.idRead })
      .first();

    if (!measure) {
      return false;
    }

    return measure.IdRead >= 0;
  }
  async getLatestStationMeasurements(
    params: IEquipsMeasurementsRepoDTO.GetLatestStationMeasurements.Params
  ): IEquipsMeasurementsRepoDTO.GetLatestStationMeasurements.Result {
    const { id } = params;

    const sqlQuery = `
      SELECT
                equipment."IdEquipment",
                stations."IdRead",
                stations."Time" AS "Date",
                stations."Hour",
                stations."TotalRadiation",
                stations."MaxRelativeHumidity",
                stations."MinRelativeHumidity",
                stations."AverageRelativeHumidity",
                stations."MaxAtmosphericTemperature",
                stations."MinAtmosphericTemperature",
                stations."AverageAtmosphericTemperature" ,
                stations."AtmosphericPressure" ,
                stations."WindVelocity",
                TRUNC(stations."Et0"::numeric,2) AS "Et0"
            FROM equipments."MetereologicalEquipment" AS equipment
            LEFT JOIN equipments."ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            INNER JOIN equipments."MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
            WHERE equipment."IdEquipment" = ?
            ORDER BY stations."IdRead" DESC
            LIMIT 1;
    `;

    const data = await governmentDb.raw(sqlQuery, [id]);

    if (!data.rows.length) {
      return null;
    }

    const row = data.rows[0];

    return mapStationMeasurementsWithUnitsToDomain(row);
  }
  async getLatestPluviometerMeasurements(
    params: IEquipsMeasurementsRepoDTO.GetLatestPluviometerMeasurements.Params
  ): IEquipsMeasurementsRepoDTO.GetLatestPluviometerMeasurements.Result {
    const { id } = params;

    const sqlQuery = `
      SELECT
          pluviometer."IdRead",
          pluviometer."Time" ,
          pluviometer."Hour" ,
          organ."Name" AS "OrganName",
          organ."IdOrgan",
          TRUNC(pluviometer."Value"::numeric,2) AS "Value",
          pluviometer."FK_Equipment"
      FROM
                    equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."ReadPluviometers" AS pluviometer
                    ON
                equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN equipments."MetereologicalOrgan" AS organ
                      ON
                organ."IdOrgan" = equipment."FK_Organ"
      WHERE
                equipment."IdEquipment" = ?
      ORDER BY
          pluviometer."IdRead" DESC
      LIMIT 1;
    `;

    const data = await governmentDb.raw(sqlQuery, [id]);

    if (!data.rows.length) {
      return null;
    }

    const row = data.rows[0];

    return mapPluviometerMeasurementsWithUnitsToDomain(row);
  }
  async getPluviometersReads(
    params: IEquipsMeasurementsRepoDTO.GetPluviometers.Params
  ): IEquipsMeasurementsRepoDTO.GetPluviometers.Result {
    const { idEquipment, pageNumber, limit, time } = params;

    const binding = [];
    const queries: Array<any> = [];
    const pageLimit = limit || 20;
    const offset = pageNumber;

    queries.push(`WHERE equipment."IdEquipment" = ?`);
    binding.push(idEquipment);

    if (time) {
      queries.push(`AND pluviometer."Time" >= ?`);
      binding.push(time.start);

      if (time.end !== null) {
        queries.push(`AND pluviometer."Time" <= ?`);
        binding.push(time.end);
      }
    }

    const countSQL = `
      SELECT
          count("IdEquipment")
      FROM
        equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."ReadPluviometers" AS pluviometer
        ON equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN equipments."MetereologicalOrgan" AS organ
          ON organ."IdOrgan" = equipment."FK_Organ"
                     ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(governmentDb)(countSQL, binding);

    queries.push('ORDER BY pluviometer."Time" ASC');
    queries.push(`LIMIT ? OFFSET ?`);
    binding.push(pageLimit);
    binding.push(offset);

    const sql = `
      SELECT
          pluviometer."IdRead",
          pluviometer."Time" ,
          pluviometer."Hour" ,
          organ."Name" AS "OrganName",
          organ."IdOrgan",
          TRUNC(pluviometer."Value"::numeric,2) AS "Value"
      FROM
        equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."ReadPluviometers" AS pluviometer
        ON equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN equipments."MetereologicalOrgan" AS organ
          ON organ."IdOrgan" = equipment."FK_Organ"
      ${queries.join(" ")};
  `;

    const data = await governmentDb.raw(sql, binding);

    const rows = data.rows;

    if (!rows.length) {
      return null;
    }

    const toDomain = rows.map((row: any) =>
      mapPluviometerMeasurementsWithUnitsToDomain(row)
    );

    return toPaginatedOutput({
      data: toDomain,
      page: pageNumber,
      limit: pageLimit,
      count: countRows,
    });
  }
  async updateStationMeasures(
    measurements: {
      IdRead: number;
      TotalRadiation: number | null;
      AverageRelativeHumidity: number | null;
      MinRelativeHumidity: number | null;
      MaxRelativeHumidity: number | null;
      AverageAtmosphericTemperature: number | null;
      MaxAtmosphericTemperature: number | null;
      MinAtmosphericTemperature: number | null;
      AtmosphericPressure: number | null;
      Et0: number | null;
      WindVelocity: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb.transaction(async (trx) => {
      await trx("ReadStations")
        .withSchema("equipments")
        .update({
          TotalRadiation: measurements.TotalRadiation,
          AverageRelativeHumidity: measurements.AverageRelativeHumidity,
          MinRelativeHumidity: measurements.MinRelativeHumidity,
          MaxRelativeHumidity: measurements.MaxRelativeHumidity,
          AverageAtmosphericTemperature:
            measurements.AverageAtmosphericTemperature,
          MaxAtmosphericTemperature: measurements.MaxAtmosphericTemperature,
          MinAtmosphericTemperature: measurements.MinAtmosphericTemperature,
          AtmosphericPressure: measurements.AtmosphericPressure,
          WindVelocity: measurements.WindVelocity,
          Et0: measurements.Et0,
        })
        .where("IdRead", measurements.IdRead);
    });

    await governmentDb
      .insert({
        User_Id: operation.author,
        Resource: "equipment-measurements",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }
  async updatePluviometerMeasures(
    measurements: { IdRead: number; Precipitation: number | null },
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb("ReadPluviometers")
      .withSchema("equipments")
      .update({
        Value: measurements.Precipitation,
      })
      .where("IdRead", measurements.IdRead);

    await governmentDb
      .insert({
        User_Id: operation.author,
        Resource: "equipment-measurements",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }
  async getStationsMeasurementsByIds(
    ids: IEquipsMeasurementsRepoDTO.GetStationsMeasurementsByIds.Params
  ): IEquipsMeasurementsRepoDTO.GetStationsMeasurementsByIds.Result {
    const whereSQL = `
      WHERE
              rs."IdRead" IN (
                  ${ids.map((_) => "?").join(",")}
              )
    `;
    const querySQL = `
      WITH StationMeasurements AS (
          SELECT
              rs.*
          FROM
              equipments."ReadStations" AS rs
          ${whereSQL}
      )
      SELECT
          me."IdEquipment",
          me."Altitude" ,
          me."Latitude" ,
          me."Longitude" ,
          rs.*
      FROM
          StationMeasurements AS rs
      INNER JOIN equipments."MetereologicalEquipment" me
      ON
          me."IdEquipment" = rs."FK_Equipment"
    `;

    const response = await governmentDb.raw(querySQL, ids);

    if (response.rows.length) {
      return response.rows.map((row: any) => {

        return {
          IdRead: row.IdRead,
          Time: row.Time,
          Hour: row.Hour,
          Altitude: row.Altitude,
          Longitude: row.Longitude,
          Latitude: row.Latitude,
          AverageAtmosphericTemperature: row.AverageAtmosphericTemperature,
          MinAtmosphericTemperature: row.MinAtmosphericTemperature,
          MaxAtmosphericTemperature: row.MaxAtmosphericTemperature,
          AverageRelativeHumidity: row.AverageRelativeHumidity,
          MaxRelativeHumidity: row.MaxRelativeHumidity,
          MinRelativeHumidity: row.MinRelativeHumidity,
          AtmosphericPressure: row.AtmosphericPressure,
          TotalRadiation: row.TotalRadiation,
          WindVelocity: row.WindVelocity,
        };
      });
    }

    return null;
  }
  async checkIfStationMeasurementsAlreadyExists(
    idRead: number
  ): Promise<boolean> {
    const measure = await governmentDb
      .withSchema("equipments")
      .select("IdRead")
      .from("ReadStations")
      .where({ IdRead: idRead })
      .first();

    if (!measure) {
      return false;
    }

    return !!measure;
  }
  async getStationsReads(
    params: IEquipsMeasurementsRepoDTO.GetStations.Params
  ): IEquipsMeasurementsRepoDTO.GetStations.Result {
    const { idEquipment, pageNumber, limit, time } = params;
    const pageLimit = limit || 20;
    // TODO: add format input here!
    const pageOffset = pageNumber;

    const binding = [];
    const queries: Array<any> = [];

    queries.push(`WHERE equipment."IdEquipment" = ?`);
    binding.push(idEquipment);

    if (time) {
      queries.push(`AND stations."Time" >= ?`);
      binding.push(time.start);

      if (time.end !== null) {
        queries.push(`AND stations."Time" <= ?`);
        binding.push(time.end);
      }
    }

    const countSQL = `
      SELECT
                     count(equipment."IdEquipment")
                 FROM equipments."MetereologicalEquipment" AS equipment
            LEFT JOIN equipments."ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            INNER JOIN equipments."MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
                     ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(governmentDb)(countSQL, binding);

    queries.push('ORDER BY stations."Time" ASC');
    queries.push(`LIMIT ? OFFSET ?`);
    binding.push(pageLimit);
    binding.push(pageOffset);

    const sqlQuery = `
              SELECT
                stations."IdRead",
                stations."Time" AS "Date",
                stations."Hour",
                equipment."IdEquipment",
                equipment."IdEquipmentExternal" AS "EquipmentCode",
                organ."IdOrgan",
                organ."Name" AS "OrganName",
                equipment."Altitude",
                stations."TotalRadiation",
                stations."MaxRelativeHumidity",
                stations."MinRelativeHumidity",
                stations."AverageRelativeHumidity",
                stations."MaxAtmosphericTemperature",
                stations."MinAtmosphericTemperature",
                stations."AverageAtmosphericTemperature" ,
                stations."AtmosphericPressure" ,
                stations."WindVelocity",
                TRUNC(stations."Et0"::numeric,2) AS "Et0"
            FROM equipments."MetereologicalEquipment" AS equipment
            LEFT JOIN equipments."ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            INNER JOIN equipments."MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
            ${queries.join(" ")}
    `;

    const data = await governmentDb.raw(sqlQuery, binding);

    const rows = data.rows;

    if (!rows.length) {
      return null;
    }

    const measuresToDomain = rows.map((row: any) =>
      mapStationMeasurementsWithUnitsToDomain(row)
    );

    return toPaginatedOutput({
      data: measuresToDomain,
      page: pageNumber,
      limit: pageLimit,
      count: countRows,
    });
  }
  async checkIfPluviometerMeasurementsExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfMeasurementsExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfMeasurementsExists.Result {
    const { id } = params;

    const sqlQuery = `
      SELECT
          pluviometer."IdRead",
          pluviometer."Time" ,
          pluviometer."Hour" ,
          organ."Name" AS "OrganName",
          organ."IdOrgan",
          pluviometer."Value",
          pluviometer."FK_Equipment"
      FROM
                    equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."ReadPluviometers" AS pluviometer
                    ON
                equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN equipments."MetereologicalOrgan" AS organ
                      ON
                organ."IdOrgan" = equipment."FK_Organ"
      WHERE
                equipment."IdEquipment" = ?
      ORDER BY
          pluviometer."IdRead" DESC
      LIMIT 1;
    `;

    const response = await governmentDb.raw(sqlQuery, [id]);

    if (!response.rows.length) {
      return false;
    }

    const data = response.rows[0];

    return !!data;
  }
  async getStationMeasurementsById(
    id: IEquipsMeasurementsRepoDTO.GetStationMeasurementsById.Params
  ): IEquipsMeasurementsRepoDTO.GetStationMeasurementsById.Result {
    const whereSQL = `
      WHERE
              rs."IdRead" = ?
    `;
    const querySQL = `
      WITH StationMeasurements AS (
          SELECT
              rs.*
          FROM
              equipments."ReadStations" AS rs
          ${whereSQL}
      )
      SELECT
          me."IdEquipment",
          me."Altitude" ,
          rs.*
      FROM
          StationMeasurements AS rs
      INNER JOIN equipments."MetereologicalEquipment" me
      ON
          me."IdEquipment" = rs."FK_Equipment"
    `;

    const response = await governmentDb.raw(querySQL, id);

    const rawMeasure = response.rows[0];

    if (rawMeasure) {
      return {
        IdRead: rawMeasure.IdRead,
        IdEquipment: rawMeasure.IdEquipment,
        Time: rawMeasure.Time,
        Hour: rawMeasure.Hour,
        AverageAtmosphericTemperature: rawMeasure.AverageAtmosphericTemperature,
        MinAtmosphericTemperature: rawMeasure.MinAtmosphericTemperature,
        MaxAtmosphericTemperature: rawMeasure.MaxAtmosphericTemperature,
        AverageRelativeHumidity: rawMeasure.AverageRelativeHumidity,
        MaxRelativeHumidity: rawMeasure.MaxRelativeHumidity,
        MinRelativeHumidity: rawMeasure.MinRelativeHumidity,
        AtmosphericPressure: rawMeasure.AtmosphericPressure,
        TotalRadiation: rawMeasure.TotalRadiation,
        WindVelocity: rawMeasure.WindVelocity,
      };
    }

    return null;
  }
  async checkIfUserStationHasYesterdayEtoMeasurements(
    user_id: number
  ): Promise<boolean> {
    // get user's station with yesterday ET0 measurement
    const dbResponse = await governmentDb.raw(
      `
      SELECT me."IdEquipmentExternal", me."Name" , rs."Et0"  FROM  (
          SELECT * FROM management."User_Equipments" ue
          WHERE ue.user_id = ?
      ) AS n1
      INNER JOIN equipments."MetereologicalEquipment" me
      ON me."IdEquipment" = n1."station_id"
      INNER JOIN government.equipments."ReadStations" rs
      ON me."IdEquipment" = rs."FK_Equipment"
      WHERE rs."Time" = (DATE_TRUNC('day', NOW()::date) - INTERVAL '3 hours')::date
      AND rs."Et0"  IS NOT NULL`,
      [user_id]
    );

    if (dbResponse.rows.length == 0) {
      return false;
    }

    return true;
  }

  async getLastMeasurementsFromStation(
    idStation: number,
    date: string
  ): Promise<null | { Time: Date; Et0: number }> {
    const data = await governmentDb
      .withSchema("equipments")
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

  async getLastMeasurementsFromPluviometer(
    idPluviometer: number
  ): Promise<null | { Time: Date; Precipitation: number }> {
    const data = await governmentDb
      .withSchema("equipments")
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

  async insertStations(measurements: Array<any>): Promise<Array<number>> {
    let ids: Array<number> = [];

    await governmentDb.transaction(async (trx) => {
      ids = await trx
        .batchInsert<any>(
          "equipments.ReadStations",
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
              AverageAtmosphericTemperature: item.AverageAtmosphericTemperature,
              AtmosphericPressure: item.AtmosphericPressure,
              WindVelocity: item.WindVelocity,
              Et0: item.Et0 || null,
            };
          })
          //@ts-ignore
        )
        .returning("IdRead");
    });

    return ids;
  }

  async bulkInsert(
    measurements: Array<
      StationMeasurementsToPersist | PluviometerMeasurementsToPersist
    >,
    type: "station" | "pluviometer"
  ): Promise<Array<number>> {
    let ids: Array<number> = [];

    switch (type) {
      case "station":
        await governmentDb.transaction(async (trx) => {
          ids = await trx
            .batchInsert<any>(
              "equipments.ReadStations",
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
            )
            .returning("IdRead");
        });

        return ids;

      case "pluviometer":
        await governmentDb.transaction(async (trx) => {
          await trx.batchInsert(
            "equipments.ReadPluviometers",
            measurements.map((eqp: any) => {
              return {
                FK_Equipment: eqp.FK_Equipment,
                FK_Organ: eqp.FK_Organ,
                Time: eqp.Time,
                Hour: eqp.Hour,
                Value: eqp.Precipitation,
              };
            })
          );
        });
        break;
      default:
        throw new Error("Necessário informar um tipo de equipamento válido");
    }

    return ids;
  }

  async bulkUpdate(
    measurements: Array<any>,
    type: "station" | "pluviometer"
  ): Promise<void> {
    try {
      switch (type) {
        case "station":
          await updateStationsMeasurements(measurements);
          break;
        case "pluviometer":
          await updatePluviometerMeasurements(measurements);
          break;
      }

      console.log("Sucesso ao atualizar medições");
    } catch (error) {
      console.error("Error during batch update:", error);
      throw error;
    }
  }

  async getStationCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<Array<string>> {
    const result = await governmentDb
      .withSchema("equipments")
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

  async getPluviometersCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<Array<string>> {
    const result = await governmentDb
      .withSchema("equipments")
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

  async getStationMeasurementsByTime(
    time: string,
    id_organ: number
  ): Promise<
    Map<
      number,
      {
        IdRead: number;
        TotalRadiation: number | null;
        MaxRelativeHumidity: number | null;
        MinRelativeHumidity: number | null;
        AverageRelativeHumidity: number | null;
        MaxAtmosphericTemperature: number | null;
        MinAtmosphericTemperature: number | null;
        AverageAtmosphericTemperature: number | null;
        AtmosphericPressure: number | null;
        WindVelocity: number | null;
        Et0?: number | null;
      }
    >
  > {
    const sqlQuery = governmentDb
      .withSchema("equipments")
      .column([
        "IdRead",
        "FK_Equipment",
        "TotalRadiation",
        "MaxRelativeHumidity",
        "MinRelativeHumidity",
        "AverageRelativeHumidity",
        "MaxAtmosphericTemperature",
        "MinAtmosphericTemperature",
        "AverageAtmosphericTemperature",
        "AtmosphericPressure",
        "WindVelocity",
        "Et0",
      ])
      .select()
      .where({ Time: time })
      .andWhere({ FK_Organ: id_organ })
      .from("ReadStations");

    const response = await sqlQuery;

    const measurements: Map<
      number,
      {
        IdRead: number;
        TotalRadiation: number | null;
        MaxRelativeHumidity: number | null;
        MinRelativeHumidity: number | null;
        AverageRelativeHumidity: number | null;
        MaxAtmosphericTemperature: number | null;
        MinAtmosphericTemperature: number | null;
        AverageAtmosphericTemperature: number | null;
        AtmosphericPressure: number | null;
        WindVelocity: number | null;
        Et0?: number | null;
      }
    > = new Map();

    if (response.length) {
      response.forEach((item: any) => {
        const {
          IdRead,
          FK_Equipment,
          TotalRadiation,
          MaxRelativeHumidity,
          MinRelativeHumidity,
          AverageRelativeHumidity,
          MaxAtmosphericTemperature,
          MinAtmosphericTemperature,
          AverageAtmosphericTemperature,
          AtmosphericPressure,
          WindVelocity,
          Et0,
        } = item;

        measurements.set(FK_Equipment, {
          IdRead,
          TotalRadiation,
          MaxRelativeHumidity,
          MinRelativeHumidity,
          AverageRelativeHumidity,
          MaxAtmosphericTemperature,
          MinAtmosphericTemperature,
          AverageAtmosphericTemperature,
          AtmosphericPressure,
          WindVelocity,
          Et0,
        });
      });
    }

    return measurements;
  }

  async getPluviometerMeasurementsByTime(
    time: string,
    id_organ: number
  ): Promise<Map<number, { IdRead: number; Value: number | null }>> {
    const sqlQuery = governmentDb
      .withSchema("equipments")
      .column(["IdRead", "FK_Equipment", "Value"])
      .select()
      .where({ Time: time })
      .andWhere({ FK_Organ: id_organ })
      .from("ReadPluviometers");

    const response = await sqlQuery;

    const measurements: Map<number, { IdRead: number; Value: number | null }> =
      new Map();

    if (response.length) {
      response.forEach((item: any) => {
        const { IdRead, FK_Equipment, Value } = item;

        measurements.set(FK_Equipment, {
          IdRead,
          Value,
        });
      });
    }

    return measurements;
  }
}
/**
 * TO-DO: improve removing the temporary table
 */
async function updateStationsMeasurements(
  measurements: Array<StationMeasurementsToPersist>
): Promise<Array<number>> {
  let updatedIds: number[] = [];

  await governmentDb.transaction(async (trx) => {
    const tempTableName = "Temp_ReadStations";

    // Create a temporary table
    await trx.raw(`
        CREATE TABLE equipments."${tempTableName}" (
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
        AverageAtmosphericTemperature: measures.AverageAtmosphericTemperature,
        AtmosphericPressure: measures.AtmosphericPressure,
        WindVelocity: measures.WindVelocity,
        Et0: measures.Et0,
      };
    });

    // Insert new data into the temporary table
    await trx(`equipments.${tempTableName}`).insert(toPersistency);

    updatedIds = await trx.select("IdRead").from(`equipments.${tempTableName}`);

    // Perform the batch update
    await trx.raw(`
        UPDATE equipments."ReadStations" AS rs
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
        FROM equipments."${tempTableName}" AS t
        WHERE rs."FK_Equipment" = t."FK_Equipment" and rs."Time" = t."Time";
    `);

    // Clean up the temporary table
    await trx.raw(`DROP TABLE equipments."${tempTableName}"`);
  });

  return updatedIds;
}
/**
 * TO-DO: improve removing the temporary table
 */
async function updatePluviometerMeasurements(
  measurements: Array<PluviometerMeasurementsToPersist>
) {
  await governmentDb.transaction(async (trx) => {
    const tempTableName = "Temp_ReadPluviometers";

    // Create a temporary table
    await trx.raw(`
        CREATE TABLE equipments."${tempTableName}" (
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
        Value: eqp.Precipitation,
      };
    });

    // Insert new data into the temporary table
    await trx(`equipments.${tempTableName}`).insert(toPersistency);

    // Perform the batch update
    await trx.raw(`
        UPDATE equipments."ReadPluviometers" AS rp
        SET
          "FK_Equipment" = t."FK_Equipment",
          "FK_Organ" = t."FK_Organ",
          "Time" = t."Time",
          "Hour" = t."Hour",
          "Value" = t."Value"
        FROM equipments."${tempTableName}" AS t
        WHERE rp."FK_Equipment" = t."FK_Equipment" AND rp."Time" = t."Time";
    `);

    // Clean up the temporary table
    // await trx.dropTable(tempTableName);
    await trx.raw(`DROP TABLE equipments."${tempTableName}"`);
  });
}
