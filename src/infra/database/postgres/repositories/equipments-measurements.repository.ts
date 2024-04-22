import {
  IEquipsMeasurementsRepoDTO,
  IEquipmentsMeasuresRepository,
} from "../../../../domain/use-cases/_ports/repositories/equipments-measurements.repository";
import { equipments } from "../connection/knexfile";
import { countTotalRows, toPaginatedOutput } from "./utils/paginate";

export class EquipmentsMeasurementsRepository
  implements IEquipmentsMeasuresRepository
{
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
              "ReadStations" AS rs
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
      INNER JOIN equipments.public."MetereologicalEquipment" me 
      ON
          me."IdEquipment" = rs."FK_Equipment"
    `;

    const response = await equipments.raw(querySQL, ids);

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
    console.log(pageNumber);
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
                 FROM "MetereologicalEquipment" AS equipment  
            LEFT JOIN "ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            INNER JOIN "MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
                     ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(equipments)(countSQL, binding);

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
                stations."Et0" AS "ETO"
            FROM "MetereologicalEquipment" AS equipment  
            LEFT JOIN "ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            INNER JOIN "MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
            ${queries.join(" ")}
    `;

    const data = await equipments.raw(sqlQuery, binding);

    const rows = data.rows;

    if (!rows.length) {
      return null;
    }

    const measuresToDomain = rows.map((row: any) => ({
      IdRead: Number(row.IdRead) || null,
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
        Unit: "°C",
        Value: Number(row.AverageAtmosphericTemperature) || null,
      },
      MaxAtmosphericTemperature: {
        Unit: "°C",
        Value: Number(row.MaxAtmosphericTemperature) || null,
      },
      MinAtmosphericTemperature: {
        Unit: "°C",
        Value: Number(row.MinAtmosphericTemperature) || null,
      },
      AtmosphericPressure: {
        Unit: "°C",
        Value: Number(row.AtmosphericPressure) || null,
      },
      WindVelocity: {
        Unit: "m/s",
        Value: Number(row.WindVelocity) || null,
      },
      ETO: {
        Unit: "mm",
        Value: Number(row.ETO) || null,
      },
    }));

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
        "MetereologicalEquipment" AS equipment 
      INNER JOIN "ReadPluviometers" AS pluviometer
        ON equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN "MetereologicalOrgan" AS organ
          ON organ."IdOrgan" = equipment."FK_Organ"
                     ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(equipments)(countSQL, binding);

    console.log("[COUNT] ", countRows);

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
          pluviometer."Value"
      FROM
        "MetereologicalEquipment" AS equipment 
      INNER JOIN "ReadPluviometers" AS pluviometer
        ON equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN "MetereologicalOrgan" AS organ
          ON organ."IdOrgan" = equipment."FK_Organ"
      ${queries.join(" ")};
  `;

    const data = await equipments.raw(sql, binding);

    const rows = data.rows;

    if (!rows.length) {
      return null;
    }

    const toDomain = rows.map((row: any) => ({
      IdRead: Number(row.IdRead) || null,
      Time: row.Time,
      Hour: row.Hour,
      Precipitation: {
        Unit: "mm",
        Value: Number(row.Value) || null,
      },
    }));

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
                stations."Et0"
            FROM "MetereologicalEquipment" AS equipment  
            LEFT JOIN "ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            INNER JOIN "MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
            WHERE equipment."IdEquipment" = ?
            ORDER BY stations."IdRead" DESC
            LIMIT 1;
    `;

    const data = await equipments.raw(sqlQuery, [id]);

    if (!data.rows.length) {
      return null;
    }

    const row = data.rows[0];

    return {
      IdRead: Number(row.IdRead),
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
        Unit: "°C",
        Value: Number(row.AverageAtmosphericTemperature) || null,
      },
      MaxAtmosphericTemperature: {
        Unit: "°C",
        Value: Number(row.MaxAtmosphericTemperature) || null,
      },
      MinAtmosphericTemperature: {
        Unit: "°C",
        Value: Number(row.MinAtmosphericTemperature) || null,
      },
      AtmosphericPressure: {
        Unit: "°C",
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
          pluviometer."Value",
          pluviometer."FK_Equipment"
      FROM
                    "MetereologicalEquipment" AS equipment
      INNER JOIN "ReadPluviometers" AS pluviometer
                    ON
                equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN "MetereologicalOrgan" AS organ
                      ON
                organ."IdOrgan" = equipment."FK_Organ"
      WHERE
                equipment."IdEquipment" = ?
      ORDER BY
          pluviometer."IdRead" DESC
      LIMIT 1;
    `;

    const data = await equipments.raw(sqlQuery, [id]);

    if (!data.rows.length) {
      return null;
    }

    const row = data.rows[0];

    return {
      IdRead: Number(row.IdRead),
      IdEquipment: Number(row.FK_Equipment),
      Time: row.Time,
      Hour: row.Hour,
      Precipitation: {
        Unit: "mm",
        Value: Number(row.Value),
      },
    };
  }
  async checkIfPluviometerMeasureTimeAlreadyExists(
    params: IEquipsMeasurementsRepoDTO.CheckIfPluviometerMeasureTimeAlreadyExists.Params
  ): IEquipsMeasurementsRepoDTO.CheckIfPluviometerMeasureTimeAlreadyExists.Result {
    const measure = await equipments
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
    const measure = await equipments
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
    const measure = await equipments
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
    request: IEquipsMeasurementsRepoDTO.UpdateStationMeasures.Params
  ): IEquipsMeasurementsRepoDTO.UpdateStationMeasures.Result {
    await equipments.transaction(async (trx) => {
      await trx("ReadStations")
        .update({
          TotalRadiation: request.TotalRadiation,
          AverageRelativeHumidity: request.AverageRelativeHumidity,
          MinRelativeHumidity: request.MinRelativeHumidity,
          MaxRelativeHumidity: request.MaxRelativeHumidity,
          AverageAtmosphericTemperature: request.AverageAtmosphericTemperature,
          MaxAtmosphericTemperature: request.MaxAtmosphericTemperature,
          MinAtmosphericTemperature: request.MinAtmosphericTemperature,
          AtmosphericPressure: request.AtmosphericPressure,
          WindVelocity: request.WindVelocity,
          Et0: request.Et0,
        })
        .where("IdRead", request.IdRead);
    });
  }
  async updatePluviometerMeasures(
    request: IEquipsMeasurementsRepoDTO.UpdatePluviometerMeasures.Params
  ): IEquipsMeasurementsRepoDTO.UpdatePluviometerMeasures.Result {
    await equipments("ReadPluviometers")
      .update({
        Value: request.Value,
        Time: request.Time,
        Hour: request.Hour,
      })
      .where("IdRead", request.IdRead);
  }
  async bulkUpdateEt0(
    measurements: IEquipsMeasurementsRepoDTO.BulkUpdateEt0.Params
  ): IEquipsMeasurementsRepoDTO.BulkUpdateEt0.Result {
    const trx = await equipments.transaction();
    try {
      await Promise.all(
        measurements.map((read) => {
          return equipments("ReadStations")
            .where("IdRead", read.IdRead)
            .update({
              Et0: read.Et0,
            })
            .transacting(trx); // This makes every update be in the same transaction
        })
      );

      await trx.commit();
    } catch (error) {
      console.error(error);
      await trx.rollback();
    }
  }
}
