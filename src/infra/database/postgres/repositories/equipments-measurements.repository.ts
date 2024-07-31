import { PluviometerReadEntity } from "../../../../domain/entities/equipments/PluviometerRead";
import { StationReadEntity } from "../../../../domain/entities/equipments/StationRead";
import {
  IEquipsMeasurementsRepoDTO,
  IEquipmentsMeasuresRepository,
} from "../../../../domain/use-cases/_ports/repositories/equipments-measurements.repository";
import { toPaginatedOutput } from "../../../../domain/use-cases/helpers/pagination";
import { UserCommandOperationProps } from "../../../../modules/UserOperations/protocols/logger";
import { governmentDb, logsDb } from "../connection/knexfile";
import { countTotalRows } from "./utils/paginate";

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
      Unit: "hPa",
      Value: Number(row.AverageAtmosphericTemperature) || null,
    },
    MaxAtmosphericTemperature: {
      Unit: "hPa",
      Value: Number(row.MaxAtmosphericTemperature) || null,
    },
    MinAtmosphericTemperature: {
      Unit: "hPa",
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
  implements IEquipmentsMeasuresRepository
{
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
          ST_AsGeoJSON(
                                    me."Location"::geometry
          )::json AS "GeoLocation" ,
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
          ST_AsGeoJSON(
                                    me."Location"::geometry
          )::json AS "GeoLocation" ,
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
        const coordinates = row.GeoLocation
          ? row.GeoLocation["coordinates"]
          : null;

        return {
          IdRead: row.IdRead,
          Time: row.Time,
          Hour: row.Hour,
          Altitude: row.Altitude,
          Longitude: coordinates[1],
          Latitude: coordinates[0],
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

    await logsDb
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
    measurements: {
      IdRead: number;
      Precipitation: number | null;
    },
    operation: UserCommandOperationProps
  ): Promise<void> {
    await governmentDb("ReadPluviometers")
      .withSchema("equipments")
      .update({
        Value: measurements.Precipitation,
      })
      .where("IdRead", measurements.IdRead);

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "equipment-measurements",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }
}
