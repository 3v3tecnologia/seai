import {
  EquipmentsMeasuresRepositoryProtocol,
  EquipmentsRepositoryProtocol,
  MeteorologicalOrganRepositoryProtocol,
  MeasuresRepositoryDTOProtocol,
  MeteorologicalOrganRepositoryDTOProtocol,
  EquipmentRepositoryDTOProtocol,
} from "../../../../domain/use-cases/_ports/repositories/equipments-repository";
import { equipments } from "../connection/knexfile";

/*
  TO-DO : Create domain layer
*/
export class KnexEquipmentsRepository
  implements
    EquipmentsRepositoryProtocol,
    EquipmentsMeasuresRepositoryProtocol,
    MeteorologicalOrganRepositoryProtocol
{
  private measuresLimitRow = 30;
  private equipmentsLimitRow = 90;

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

  async updateEquipment(
    equipment: EquipmentRepositoryDTOProtocol.Update.Params
  ): EquipmentRepositoryDTOProtocol.Update.Result {
    await equipments.transaction(async (trx) => {
      const rawResult = await trx("MetereologicalEquipment")
        .update({
          IdEquipmentExternal: equipment.IdEquipmentExternal,
          Name: equipment.Name,
          Altitude: equipment.Altitude,
          FK_Organ: equipment.Fk_Organ,
          FK_Type: equipment.Fk_Type,
          UpdatedAt: equipments.fn.now(),
        })
        .returning("IdEquipment")
        .where("IdEquipment", equipment.IdEquipment);

      const toGeometryPointSQL = `'POINT(${equipment.Location.Coordinates[0]} ${equipment.Location.Coordinates[1]})'::geometry`;

      await trx.raw(
        `
        UPDATE "EquipmentLocation" 
        SET "Location" = ${toGeometryPointSQL},
        "Name" = ?
        WHERE "FK_Equipment" = ?
      `,
        [equipment.Location.Name, equipment.IdEquipment]
      );
    });
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
    const { idOrgan, idType, pageNumber, limit, name } = params;

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
          to_tsvector('simple', coalesce(equipment."IdEquipmentExternal", ''))         || 
          to_tsvector('simple', coalesce(eqpLocation."Name", '')) 
          ) @@ to_tsquery('simple', '${name}:*')`);
      } else {
        queries.push(`WHERE (
          to_tsvector('simple', coalesce(equipment."Name", ''))      || 
          to_tsvector('simple', coalesce(equipment."IdEquipmentExternal", ''))         || 
          to_tsvector('simple', coalesce(eqpLocation."Name", '')) 
          ) @@ to_tsquery('simple', '${name}:*')`);
      }
      // binding.push(name);
    }

    queries.push(`LIMIT ? OFFSET ?`);
    binding.push(limit || 100);
    binding.push(pageNumber ? limit * (pageNumber - 1) : 0);

    const sql = `
    SELECT
          (
        SELECT
            reltuples::bigint AS estimate
        FROM
            pg_class
        WHERE
            oid = 'public."MetereologicalEquipment"'::regclass
    ) AS total_registers, 
          (
        SELECT
            json_agg(t.*)
        FROM
            (
                SELECT
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
                    eqpLocation."IdLocation" ,
                    ST_AsGeoJSON(
                        eqpLocation."Location"::geometry
                    )::json AS "GeoLocation",
                    eqpLocation."Name" AS "LocationName"
                FROM
                    "MetereologicalEquipment" AS equipment
                INNER JOIN "MetereologicalOrgan" AS organ ON
                    organ."IdOrgan" = equipment."FK_Organ"
                INNER JOIN "EquipmentType" eqpType ON
                    eqpType."IdType" = equipment."FK_Type"
                LEFT JOIN "EquipmentLocation" AS eqpLocation ON
                    eqpLocation."FK_Equipment" = equipment."IdEquipment"
               ${queries.join(" ").concat(") AS t) AS equipments")}`;

    console.log("SQL :: ", sql, binding);

    const data = await equipments.raw(sql, binding);

    const rows = data.rows[0];
    if (!rows.equipments) {
      return null;
    }

    // [ { total_registers: 'number', equipments: [ [Object] ] } ]
    console.log("DATA :: ", data.rows);

    const toDomain = rows.equipments.map((row: any) => ({
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
        Id: Number(row.IdLocation) || null,
        Name: row.LocationName,
        Coordinates: row.GeoLocation ? row.GeoLocation["coordinates"] : null,
      },
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
    }));

    return {
      count: Number(rows.total_registers) || 0,
      data: toDomain,
    };
  }

  async getStationsReads(
    params: MeasuresRepositoryDTOProtocol.GetStations.Params
  ): MeasuresRepositoryDTOProtocol.GetStations.Result {
    const { idEquipment, pageNumber, limit, time } = params;

    const binding = [];
    const queries: Array<any> = [];

    queries.push(`WHERE stations."FK_Equipment" = ?`);
    binding.push(idEquipment);

    if (time !== null) {
      queries.push(`AND stations."Time" >= ?`);
      binding.push(time.start);

      if (time.end !== null) {
        queries.push(`AND stations."Time" <= ?`);
        binding.push(time.end);
      }
    }
    queries.push('ORDER BY stations."Time" ASC');
    queries.push(`LIMIT ? OFFSET ?`);
    binding.push(limit || 100);
    binding.push(pageNumber ? limit * pageNumber : 0);

    const sqlQuery = `
      SELECT
          (SELECT reltuples::bigint AS estimate
      FROM   pg_class
      WHERE  oid = 'public."MetereologicalEquipment"'::regclass
          ) as total_registers, 
          (SELECT json_agg(t.*) FROM (
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
                eto."Value" AS "ETO"
            FROM "MetereologicalEquipment" AS equipment  
            LEFT JOIN "ReadStations" AS stations
            ON equipment."IdEquipment"  = stations."FK_Equipment"
            LEFT JOIN "Et0" AS eto
            ON stations."IdRead"  = eto."FK_Station_Read"
            INNER JOIN "MetereologicalOrgan" AS organ
            ON organ."IdOrgan" = stations."FK_Organ"
            ${queries.join(" ").concat(") AS t) AS measures")}
    `;

    const data = await equipments.raw(sqlQuery, binding);

    console.log("[READ STATIONS] :: ", data.rows);

    const rows = data.rows[0];

    if (!rows.measures) {
      return null;
    }

    console.log("[READ STATIONS] [MEASURES]:: ", rows);

    const measuresToDomain = rows.measures.map((row: any) => ({
      IdRead: Number(row.IdRead) || null,
      Time: row.Date,
      Hour: row.Hour,
      IdEquipment: Number(row.IdEquipment) || null,
      Code: row.EquipmentCode || null,
      OrganName: row.OrganName,
      Altitude: row.Altitude,
      Measures: {
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
      },
    }));

    return {
      count: rows.total_registers,
      data: measuresToDomain,
    };
  }
  async getPluviometersReads(
    params: MeasuresRepositoryDTOProtocol.GetPluviometers.Params
  ): MeasuresRepositoryDTOProtocol.GetPluviometers.Result {
    const { idEquipment, pageNumber, limit, time } = params;

    const binding = [];
    const queries: Array<any> = [];

    queries.push(`WHERE pluviometer."FK_Equipment" = ?`);
    binding.push(idEquipment);

    if (time !== null) {
      queries.push(`AND pluviometer."Time" >= ?`);
      binding.push(time.start);

      if (time.end !== null) {
        queries.push(`AND pluviometer."Time" <= ?`);
        binding.push(time.end);
      }
    }

    queries.push('ORDER BY pluviometer."Time" ASC');
    queries.push(`LIMIT ? OFFSET ?`);
    binding.push(limit || 100);
    binding.push(pageNumber ? limit * pageNumber : 0);

    const sql = `
      (SELECT reltuples::bigint AS estimate
      FROM   pg_class
      WHERE  oid = 'public."MetereologicalEquipment"'::regclass
          ) as total_registers,
          (SELECT json_agg(t.*) FROM (
      SELECT
          pluviometer."IdRead",
          pluviometer."Time" ,
          pluviometer."Hour" ,
          equipment."IdEquipment",
          equipment."IdEquipmentExternal" AS "EquipmentCode",
          equipment."Name",
          organ."Name" AS "OrganName",
          organ."IdOrgan",
          pluviometer."Value"
      FROM
        "MetereologicalEquipment" AS equipment 
      LEFT JOIN "ReadPluviometers" AS pluviometer
        ON equipment."IdEquipment" = pluviometer."FK_Equipment"
      INNER JOIN "MetereologicalOrgan" AS organ
          ON organ."IdOrgan" = pluviometer."FK_Organ"
      ${queries.join(" ").concat(") AS t) AS measures")};
  `;

    const data = await equipments.raw(sql, binding);

    const rows = data.rows[0];

    if (!rows.measures) {
      return null;
    }

    const toDomain = rows.measures.map((row: any) => ({
      IdRead: Number(row.IdRead) || null,
      Time: row.Time,
      Hour: row.Hour,
      IdEquipment: Number(row.IdEquipment) || null,
      Code: row.EquipmentCode || null,
      Name: row.Name,
      Organ: row.OrganName,
      Measures: {
        Precipitation: {
          Unit: "mm",
          Value: Number(row.Value) || null,
        },
      },
    }));

    return {
      count: rows.total_registers,
      data: toDomain,
    };
  }
}
