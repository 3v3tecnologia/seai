import { Knex } from "knex";
import {
  PluviometerWithLastMeasurement,
  StationWithLastMeasurement,
} from "../../../../domain/entities/equipments/Equipment";
import {
  EquipmentsMeasuresRepositoryProtocol,
  EquipmentsRepositoryProtocol,
  MeteorologicalOrganRepositoryProtocol,
  MeasuresRepositoryDTOProtocol,
  MeteorologicalOrganRepositoryDTOProtocol,
  EquipmentRepositoryDTOProtocol,
} from "../../../../domain/use-cases/_ports/repositories/equipments-repository";
import { equipments } from "../connection/knexfile";
import { countTotalRows, toPaginatedOutput } from "./utils/paginate";
import { getYesterDayDate } from "../../../../shared/utils/date";

/*
  TO-DO : Create domain layer
*/

function mapEquipmentToDomain(row: any) {
  return {
    Id: Number(row.Id),
    Code: row.EqpCode || null,
    Name: row.Name,
    Type: {
      Id: Number(row.IdType),
      Name: row.EqpType,
    },
    Organ: {
      Id: Number(row.IdOrgan),
      Name: row.OrganName,
    },
    Altitude: Number(row.Altitude) || null,
    Location: {
      Coordinates: row.GeoLocation ? row.GeoLocation["coordinates"] : null,
    },
  };
}

export class DbEquipmentsRepository
  implements
    EquipmentsRepositoryProtocol,
    EquipmentsMeasuresRepositoryProtocol,
    MeteorologicalOrganRepositoryProtocol
{
  async getMeteorologicalOrgans(): MeteorologicalOrganRepositoryDTOProtocol.Get.Result {
    const data = await equipments
      .select("IdOrgan", "Name", "Host", "User")
      .from("MetereologicalOrgan");

    if (data.length === 0) {
      return null;
    }

    return data.map((raw) => {
      const { IdOrgan, Name, Host, User } = raw;

      return {
        Id: Number(IdOrgan),
        Name,
        Host,
        User,
      };
    });
  }

  async createMeteorologicalOrgan(
    params: MeteorologicalOrganRepositoryDTOProtocol.Create.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.Create.Result {
    const rawResult = await equipments
      .insert({
        Name: params.Name,
        Host: params.Host,
        User: params.User,
        Password: params.Password,
      })
      .returning("IdOrgan")
      .into("MetereologicalOrgan");

    const IdOrgan = rawResult[0].IdOrgan;

    return IdOrgan ? Number(IdOrgan) : null;
  }

  async updateMeteorologicalOrgan(
    organ: MeteorologicalOrganRepositoryDTOProtocol.Update.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.Update.Result {
    return await equipments("MetereologicalOrgan")
      .update({
        Name: organ.Name,
        Host: organ.Host,
        User: organ.User,
        Password: organ.Password,
      })
      .where({ IdOrgan: organ.Id });
  }

  async deleteMeteorologicalOrgan(
    idOrgan: MeteorologicalOrganRepositoryDTOProtocol.Delete.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.Delete.Result {
    return await equipments("MetereologicalOrgan")
      .where({ IdOrgan: idOrgan })
      .del();
  }

  async deleteEquipment(
    idEquipment: EquipmentRepositoryDTOProtocol.Delete.Params
  ): EquipmentRepositoryDTOProtocol.Delete.Result {
    return await equipments("MetereologicalEquipment")
      .where({ IdEquipment: idEquipment })
      .del();
  }

  async createEquipment(
    equipment: EquipmentRepositoryDTOProtocol.Create.Params
  ): EquipmentRepositoryDTOProtocol.Create.Result {
    let idEquipment = null;

    await equipments.transaction(async (trx) => {
      const rawResult = await trx
        .insert({
          IdEquipmentExternal: equipment.IdEquipmentExternal,
          Name: equipment.Name,
          Altitude: equipment.Altitude,
          FK_Organ: equipment.Fk_Organ,
          FK_Type: equipment.Fk_Type,
          Enable: equipment.Enable,
          CreatedAt: equipments.fn.now(),
        })
        .returning("IdEquipment")
        .into("MetereologicalEquipment")
        .transacting(trx);

      idEquipment = rawResult[0].IdEquipment;

      const toGeometryPointSQL = `'POINT(${equipment.Location.Coordinates[0]} ${equipment.Location.Coordinates[1]})'::geometry`;

      await trx
        .raw(
          `INSERT INTO "EquipmentLocation" ("Location","Name","FK_Equipment") 
        VALUES (${toGeometryPointSQL},?,?)`,
          [equipment.Location.Name, idEquipment]
        )
        .transacting(trx);

      console.log(`Equipamento ${idEquipment} cadastrado com sucesso`);
    });

    return idEquipment ? Number(idEquipment) : null;
  }

  async updateEquipment(equipment: {
    IdEquipment: number;
    Enable: boolean;
  }): Promise<void> {
    await equipments.transaction(async (trx) => {
      await trx("MetereologicalEquipment")
        .update({
          Enable: equipment.Enable,
          UpdatedAt: equipments.fn.now(),
        })
        .returning("IdEquipment")
        .where("IdEquipment", equipment.IdEquipment);
    });
  }

  async updateStationMeasures(
    request: MeasuresRepositoryDTOProtocol.UpdateStationMeasures.Params
  ): MeasuresRepositoryDTOProtocol.UpdateStationMeasures.Result {
    await equipments.transaction(async (trx) => {
      await trx("ReadStations")
        .update({
          Time: request.Time,
          Hour: request.Hour,
          TotalRadiation: request.TotalRadiation,
          AverageRelativeHumidity: request.AverageRelativeHumidity,
          MinRelativeHumidity: request.MinRelativeHumidity,
          MaxRelativeHumidity: request.MaxRelativeHumidity,
          AverageAtmosphericTemperature: request.AverageAtmosphericTemperature,
          MaxAtmosphericTemperature: request.MaxAtmosphericTemperature,
          MinAtmosphericTemperature: request.MinAtmosphericTemperature,
          AtmosphericPressure: request.AtmosphericPressure,
          WindVelocity: request.WindVelocity,
          Et0: request.ETO,
        })
        .where("IdRead", request.IdRead);
    });
  }

  async updatePluviometerMeasures(
    request: MeasuresRepositoryDTOProtocol.UpdatePluviometerMeasures.Params
  ): MeasuresRepositoryDTOProtocol.UpdatePluviometerMeasures.Result {
    await equipments("ReadPluviometers")
      .update({
        Value: request.Value,
        Time: request.Time,
        Hour: request.Hour,
      })
      .where("IdRead", request.IdRead);
  }

  async checkIfOrganExists(
    idOrgan: MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganExists.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganExists.Result {
    const exists = await equipments
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ IdOrgan: idOrgan })
      .first();

    return exists ? true : false;
  }

  async checkIfOrganNameAlreadyExists(
    organName: MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganNameAlreadyExists.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganNameAlreadyExists.Result {
    const exists = await equipments
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    return exists ? true : false;
  }

  async checkIfEquipmentCodeAlreadyExists(
    idEquipmentExternal: string
  ): Promise<boolean> {
    const exists = await equipments
      .select("IdEquipment")
      .from("MetereologicalEquipment")
      .where({ IdEquipmentExternal: idEquipmentExternal })
      .first();

    return exists ? true : false;
  }
  async checkIfEquipmentIdExists(id: number): Promise<boolean> {
    const exists = await equipments
      .select("IdEquipment")
      .from("MetereologicalEquipment")
      .where({ IdEquipment: id })
      .first();

    return exists ? true : false;
  }
  async checkIfStationMeasureTimeAlreadyExists(
    params: MeasuresRepositoryDTOProtocol.CheckIfStationMeasureTimeAlreadyExists.Params
  ): MeasuresRepositoryDTOProtocol.CheckIfStationMeasureTimeAlreadyExists.Result {
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
  async checkIfPluviometerMeasureTimeAlreadyExists(
    params: MeasuresRepositoryDTOProtocol.CheckIfPluviometerMeasureTimeAlreadyExists.Params
  ): MeasuresRepositoryDTOProtocol.CheckIfPluviometerMeasureTimeAlreadyExists.Result {
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

  async getEquipmentIdByExternalCode(
    idEquipmentExternal: string
  ): Promise<number | null> {
    const rawResult = await equipments
      .select("IdEquipment")
      .from("MetereologicalEquipment")
      .where({ IdEquipmentExternal: idEquipmentExternal })
      .first();

    return rawResult ? Number(rawResult.IdEquipment) : null;
  }
  async getEquipmentId(
    id: EquipmentRepositoryDTOProtocol.GetIdBy.Params
  ): EquipmentRepositoryDTOProtocol.GetIdBy.Result {
    const result = await equipments.raw(
      `
    SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "EqpCode",
          equipment."Name",
          equipment."Altitude" ,
          equipment."CreatedAt",
          equipment."UpdatedAt" ,
          equipment."Enable",
          organ."IdOrgan" AS "IdOrgan",
          organ."Name" AS "OrganName",
          eqpType."IdType" AS "IdType",
          eqpType."Name" AS "EqpType",
          ST_AsGeoJSON(
              equipment."Location"::geometry
          )::json AS "GeoLocation"
      FROM
          "MetereologicalEquipment" AS equipment
      INNER JOIN "MetereologicalOrgan" AS organ ON
          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN "EquipmentType" eqpType ON
          eqpType."IdType" = equipment."FK_Type"
      WHERE "IdEquipment" = ?
    `,
      id
    );

    const data = result.rows[0];

    if (!data) {
      return null;
    }

    return {
      Id: Number(data.Id),
      Code: data.EqpCode || null,
      Name: data.Name,
      Type: {
        Id: Number(data.IdType),
        Name: data.EqpType,
      },
      Organ: {
        Id: Number(data.IdOrgan),
        Name: data.OrganName,
      },
      Altitude: Number(data.Altitude) || null,
      Location: {
        Coordinates: data.GeoLocation ? data.GeoLocation["coordinates"] : null,
      },
      CreatedAt: data.CreatedAt,
      UpdatedAt: data.UpdatedAt,
      Enable: data.Enable,
    };
  }

  async checkIfEquipmentTypeExists(idType: number): Promise<boolean> {
    const exists = await equipments
      .select("IdType")
      .from("EquipmentType")
      .where({ IdType: idType })
      .first();

    return exists ? true : false;
  }

  async getEquipments(
    params: EquipmentRepositoryDTOProtocol.GetByPageNumber.Params
  ): EquipmentRepositoryDTOProtocol.GetByPageNumber.Result {
    const { idOrgan, idType, pageNumber, limit, offset, name } = params;
    const pageLimit = limit;

    const binding = [];
    const queries: Array<any> = [];

    if (idOrgan) {
      queries.push(`WHERE
        organ."IdOrgan" = ?`);
      binding.push(idOrgan);
    }

    if (idType) {
      if (queries.length) {
        queries.push(`
        AND eqptype."IdType" = ?`);
      } else {
        queries.push(`
        WHERE eqptype."IdType" = ?`);
      }
      binding.push(idType);
    }

    if (name) {
      if (queries.length) {
        queries.push(`AND (
          to_tsvector('simple', coalesce(equipment."Name", ''))      || 
          to_tsvector('simple', coalesce(equipment."IdEquipmentExternal", '')) 
          ) @@ to_tsquery('simple', '${name}:*')`);
      } else {
        queries.push(`WHERE (
          to_tsvector('simple', coalesce(equipment."Name", ''))      || 
          to_tsvector('simple', coalesce(equipment."IdEquipmentExternal", ''))
          ) @@ to_tsquery('simple', '${name}:*')`);
      }
      // binding.push(name);
    }

    const countSQL = `
      SELECT
                     count(equipment."IdEquipment")
                 FROM
                     "MetereologicalEquipment" AS equipment
                 INNER JOIN "MetereologicalOrgan" AS organ ON
                     organ."IdOrgan" = equipment."FK_Organ"
                 INNER JOIN "EquipmentType" eqpType ON
                     eqpType."IdType" = equipment."FK_Type"
                     ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(equipments)(countSQL, binding);

    queries.push(`order by equipment."IdEquipment" LIMIT ? OFFSET ?`);
    binding.push(pageLimit);
    binding.push(offset);

    const sql = `
          
        SELECT
            json_agg(t.*) AS "measures"
        FROM
            (
                SELECT
                    equipment."IdEquipment" AS "Id",
                    equipment."IdEquipmentExternal" AS "EqpCode",
                    equipment."Name",
                    equipment."Altitude" ,
                    equipment."CreatedAt",
                    equipment."UpdatedAt" ,
                    equipment."Enable",
                    organ."IdOrgan" AS "IdOrgan",
                    organ."Name" AS "OrganName",
                    eqpType."IdType" AS "IdType",
                    eqpType."Name" AS "EqpType",
                    ST_AsGeoJSON(
                        equipment."Location"::geometry
                    )::json AS "GeoLocation"
                FROM
                    "MetereologicalEquipment" AS equipment
                INNER JOIN "MetereologicalOrgan" AS organ ON
                    organ."IdOrgan" = equipment."FK_Organ"
                INNER JOIN "EquipmentType" eqpType ON
                    eqpType."IdType" = equipment."FK_Type"
               ${queries.join(" ")}) as t`;

    const data = await equipments.raw(sql, binding);

    // [ { total_registers: 'number', equipments: [ [Object] ] } ]
    const rows = data.rows[0];

    if (!rows.measures) {
      return null;
    }

    const toDomain = rows.measures.map((row: any) => ({
      Id: Number(row.Id),
      Code: row.EqpCode || null,
      Name: row.Name,
      Type: {
        Id: Number(row.IdType),
        Name: row.EqpType,
      },
      Organ: {
        Id: Number(row.IdOrgan),
        Name: row.OrganName,
      },
      Altitude: Number(row.Altitude) || null,
      Location: {
        Coordinates: row.GeoLocation ? row.GeoLocation["coordinates"] : null,
      },
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
      Enable: row.Enable,
    }));

    return toPaginatedOutput({
      data: toDomain,
      page: pageNumber,
      limit: pageLimit,
      count: countRows,
    });
  }
  async getStationsReads(
    params: MeasuresRepositoryDTOProtocol.GetStations.Params
  ): MeasuresRepositoryDTOProtocol.GetStations.Result {
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
    params: MeasuresRepositoryDTOProtocol.GetPluviometers.Params
  ): MeasuresRepositoryDTOProtocol.GetPluviometers.Result {
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
    params: MeasuresRepositoryDTOProtocol.GetLatestStationMeasurements.Params
  ): MeasuresRepositoryDTOProtocol.GetLatestStationMeasurements.Result {
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
    params: MeasuresRepositoryDTOProtocol.GetLatestPluviometerMeasurements.Params
  ): MeasuresRepositoryDTOProtocol.GetLatestPluviometerMeasurements.Result {
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

  async getStationsWithYesterdayMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null
  ): Promise<Array<StationWithLastMeasurement> | null> {
    // TO-DO: filtrar só equipamentos que tenha dados do dia anterior
    const STATION_ID_TYPE = 1;
    const MEASURES_ROWS = 1;

    const yesterdayDate = getYesterDayDate("-");

    const coordinateFilter = [params?.latitude, params?.longitude].every(
      (e) => e
    )
      ? `AND ST_Intersects(ST_Buffer(equipment."Location"::geometry,${params?.distance}),'POINT(${params?.latitude} ${params?.longitude})')`
      : "";

    const query = `
        WITH Stations AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."CreatedAt",
                          equipment."UpdatedAt" ,
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType",
                          ST_AsGeoJSON(
                              equipment."Location"::geometry
          )::json AS "GeoLocation"
      FROM
                          "MetereologicalEquipment" AS equipment
      INNER JOIN "MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN "EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = ${STATION_ID_TYPE} AND equipment."Enable" = true ${coordinateFilter})
      SELECT Stations.*, Measurements.* FROM Stations,
          LATERAL (
              SELECT
                  rs."FK_Equipment" ,
                  rs."Time",
                  rs."Hour" ,
                  rs."Et0"
              FROM
                  "ReadStations" rs
              WHERE
                  rs."FK_Equipment" = Stations."Id" AND rs."Time" = '${yesterdayDate}' AND rs."Et0" >= 0
              ORDER BY
                  rs."Time" DESC
              LIMIT ${MEASURES_ROWS}
          ) AS Measurements
    `;

    const data = await equipments.raw(query);

    const rows = data.rows;

    if (!rows) {
      return null;
    }

    const stations: Array<StationWithLastMeasurement> = rows.map(
      (row: any) => ({
        ...mapEquipmentToDomain(row),
        Et0: Number(row.Et0) || null,
      })
    );

    return stations.length ? stations : null;
  }
  async getPluviometersWithYesterdayMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance: number;
    } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null> {
    // TO-DO: filtrar só equipamentos que tenha dados do dia anterior
    const yesterdayDate = getYesterDayDate("-");
    const query = `
          WITH Pluviometers AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."CreatedAt",
                          equipment."UpdatedAt" ,
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType",
                          ST_AsGeoJSON(
                              equipment."Location"::geometry
          )::json AS "GeoLocation"
      FROM
                          "MetereologicalEquipment" AS equipment
      INNER JOIN "MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN "EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = 2 AND equipment."Enable" = true ${
        [params?.latitude, params?.longitude].every((e) => e)
          ? `AND ST_Intersects(ST_Buffer(equipment."Location"::geometry,${params?.distance}),'POINT(${params?.latitude} ${params?.longitude})')`
          : ""
      })
      SELECT Pluviometers.*, Measurements.* FROM Pluviometers,
          LATERAL (
              SELECT
                  rs."FK_Equipment" ,
                  rs."Time",
                  rs."Hour" ,
                  rs."Value"
              FROM
                  "ReadPluviometers" rs
              WHERE
                  rs."FK_Equipment" = Pluviometers."Id" AND rs."Time" = '${yesterdayDate}' AND rs."Value" >= 0
              ORDER BY
                  rs."Time" DESC
              LIMIT 1
          ) AS Measurements
    `;

    const data = await equipments.raw(query);

    if (!data.rows.length) {
      return null;
    }

    const rows = data.rows;

    const pluviometers: Array<PluviometerWithLastMeasurement> = rows.map(
      (row: any) => ({
        ...mapEquipmentToDomain(row),
        Precipitation: Number(row.Value),
      })
    );

    return pluviometers.length ? pluviometers : null;
  }
}
