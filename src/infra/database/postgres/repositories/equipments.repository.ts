import {
  PluviometerWithLastMeasurement,
  StationWithLastMeasurement,
} from "../../../../domain/entities/equipments/Equipment";
import {
  EquipmentRepositoryDTOProtocol,
  EquipmentsRepositoryProtocol,
  MeteorologicalOrganRepositoryDTOProtocol,
  MeteorologicalOrganRepositoryProtocol,
} from "../../../../domain/use-cases/_ports/repositories/equipments-repository";
import { toPaginatedOutput } from "../../../../domain/use-cases/helpers/pagination";
import { governmentDb } from "../connection/knexfile";
import { countTotalRows } from "./utils/paginate";

/*
  TO-DO : Create domain layer
*/
function mapEquipmentToDomain(row: any) {
  return {
    Id: Number(row.Id),
    Enable: row.Enable,
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
    LastSync: row.LastSync,
  };
}

export class DbEquipmentsRepository
  implements
    EquipmentsRepositoryProtocol,
    MeteorologicalOrganRepositoryProtocol
{
  async getMeteorologicalOrgans(): MeteorologicalOrganRepositoryDTOProtocol.Get.Result {
    const data = await governmentDb
      .withSchema("equipments")
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
    const rawResult = await governmentDb
      .withSchema("equipments")
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
    return await governmentDb("MetereologicalOrgan")
      .withSchema("equipments")
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
    return await governmentDb("MetereologicalOrgan")
      .withSchema("equipments")
      .where({ IdOrgan: idOrgan })
      .del();
  }

  async deleteEquipment(
    idEquipment: EquipmentRepositoryDTOProtocol.Delete.Params
  ): EquipmentRepositoryDTOProtocol.Delete.Result {
    return await governmentDb("MetereologicalEquipment")
      .withSchema("equipments")
      .where({ IdEquipment: idEquipment })
      .del();
  }

  async createEquipment(
    equipmentsList: EquipmentRepositoryDTOProtocol.Create.Params
  ): EquipmentRepositoryDTOProtocol.Create.Result {
    const insertedEquipments = new Map<string, number>();

    // const st = geoLocationExtension(equipments);

    /*await equipments.transaction(async (trx) => {
      // TO-DO: how insert coordinates?
      // TO-DO: how measurements?
      const eqps = await trx
        .batchInsert<any>(
          "MetereologicalEquipment",
          equipmentsList.map((equipment) => {
            return {
              IdEquipmentExternal: equipment.IdEquipmentExternal,
              Name: equipment.Name,
              Altitude: equipment.Altitude,
              // Location: st.geomFromText("Point(-71.064544 44.28787)"),
              Location: st.geomFromText(
                `Point(${equipment.Location.Latitude} ${equipment.Location.Longitude})`
              ),
              FK_Organ: equipment.Fk_Organ,
              FK_Type: equipment.Fk_Type,
              Enable: equipment.Enabled,
              CreatedAt: equipments.fn.now(),
            };
          })
        )
        .returning(["IdEquipment", "IdEquipmentExternal"]);

      // [ { IdEquipment: 1 }, { IdEquipment: 2 } ]
      eqps.forEach((eqp) =>
        insertedEquipments.set(eqp.IdEquipmentExternal, eqp.IdEquipment)
      );
    });*/

    return insertedEquipments;
  }

  async getEquipmentsTypes() {
    const type = new Map<string, number>();

    const result = await governmentDb
      .withSchema("equipments")
      .select("IdType", "Name")
      .from("EquipmentType");

    result.forEach((raw: any) => {
      type.set(raw.Name, raw.IdType);
    });

    return type;
  }

  async updateEquipment(equipment: {
    IdEquipment: number;
    Enable: boolean;
  }): Promise<void> {
    await governmentDb.transaction(async (trx) => {
      await trx("MetereologicalEquipment")
        .withSchema("equipments")
        .update({
          Enable: equipment.Enable,
          UpdatedAt: governmentDb.fn.now(),
        })
        .returning("IdEquipment")
        .where("IdEquipment", equipment.IdEquipment);
    });
  }

  async checkIfOrganExists(
    idOrgan: MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganExists.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganExists.Result {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ IdOrgan: idOrgan })
      .first();

    return exists ? true : false;
  }

  async checkIfOrganNameAlreadyExists(
    organName: MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganNameAlreadyExists.Params
  ): MeteorologicalOrganRepositoryDTOProtocol.CheckIfOrganNameAlreadyExists.Result {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    return exists ? true : false;
  }

  async checkIfEquipmentCodeAlreadyExists(
    idEquipmentExternal: string
  ): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdEquipment")
      .from("MetereologicalEquipment")
      .where({ IdEquipmentExternal: idEquipmentExternal })
      .first();

    return exists ? true : false;
  }
  async checkIfEquipmentIdExists(id: number): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdEquipment")
      .from("MetereologicalEquipment")
      .where({ IdEquipment: id })
      .first();

    return exists ? true : false;
  }

  async getEquipmentIdByExternalCode(
    idEquipmentExternal: string
  ): Promise<number | null> {
    const rawResult = await governmentDb
      .withSchema("equipments")
      .select("IdEquipment")
      .from("MetereologicalEquipment")
      .where({ IdEquipmentExternal: idEquipmentExternal })
      .first();

    return rawResult ? Number(rawResult.IdEquipment) : null;
  }
  async getEquipmentId(
    id: number
  ): EquipmentRepositoryDTOProtocol.GetIdBy.Result {
    const result = await governmentDb.raw(
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
          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
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
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdType")
      .from("EquipmentType")
      .where({ IdType: idType })
      .first();

    return exists ? true : false;
  }

  private typeIsPluviometer(id_type: number) {
    return id_type === 2;
  }

  private typeIsStation(id_type: number) {
    return id_type == 1;
  }

  async getEquipments(
    params: EquipmentRepositoryDTOProtocol.GetByPageNumber.Params
  ): EquipmentRepositoryDTOProtocol.GetByPageNumber.Result {
    const {
      idOrgan,
      idType,
      pageNumber,
      limit,
      offset,
      name,
      only_with_measurements,
    } = params;
    const pageLimit = limit;

    const binding = [];
    const queries: Array<any> = [];

    if (idOrgan) {
      if (queries.length) {
        queries.push(`AND
        organ."IdOrgan" = ?`);
      } else {
        queries.push(`WHERE
        organ."IdOrgan" = ?`);
      }

      binding.push(idOrgan);
    }

    if (idType) {
      if (only_with_measurements === true) {
        // Station
        if (this.typeIsStation(idType)) {
          queries.push(`WHERE
    equipment."IdEquipment" IN (
        SELECT
            rs."FK_Equipment"
        FROM
            "ReadStations" rs
        WHERE
            rs."Et0" IS NOT NULL
            AND rs."Time" = CURRENT_DATE - INTERVAL '1 DAY'
    )`);
        } else {
          queries.push(`WHERE
        equipment."IdEquipment" IN (
            SELECT
                rp."FK_Equipment"
            FROM
                "ReadPluviometers" rp
            WHERE
                rp."Value" IS NOT NULL
                AND rp."Time" = CURRENT_DATE - INTERVAL '1 DAY'
          )`);
        }
      }

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
                     equipments."MetereologicalEquipment" AS equipment
                 INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                     organ."IdOrgan" = equipment."FK_Organ"
                 INNER JOIN equipments."EquipmentType" eqpType ON
                     eqpType."IdType" = equipment."FK_Type"
                     ${queries.join(" ")}
    `;

    const countRows = await countTotalRows(governmentDb)(countSQL, binding);

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
                    lastSync."completedon" as "LastSync",
                    organ."IdOrgan" AS "IdOrgan",
                    organ."Name" AS "OrganName",
                    eqpType."IdType" AS "IdType",
                    eqpType."Name" AS "EqpType",
                    ST_AsGeoJSON(
                        equipment."Location"::geometry
                    )::json AS "GeoLocation"
                FROM
                    equipments."MetereologicalEquipment" AS equipment
                INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                    organ."IdOrgan" = equipment."FK_Organ"
                INNER JOIN equipments."LastUpdatedAt" AS lastSync
                  ON lastSync."fk_organ" = equipment."FK_Organ"
                INNER JOIN equipments."EquipmentType" eqpType ON
                    eqpType."IdType" = equipment."FK_Type"
               ${queries.join(" ")}) as t`;

    const data = await governmentDb.raw(sql, binding);

    // [ { total_registers: 'number', equipments: [ [Object] ] } ]
    const rows = data.rows[0];

    if (!rows.measures) {
      return null;
    }

    const toDomain = rows.measures.map((row: any) => ({
      ...mapEquipmentToDomain(row),
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

  async getStationsWithYesterdayMeasurements(
    params: {
      latitude: number;
      longitude: number;
      distance?: number;
    } | null
  ): Promise<Array<StationWithLastMeasurement> | null> {
    const STATION_ID_TYPE = 1;
    const MEASURES_ROWS = 1;

    const timeZone = 3;
    const withoutLocalTimezone = `(DATE_TRUNC('day', NOW()::date) - INTERVAL '${timeZone} hours')::date`;

    // TODO: Need to refactor to bind params
    const coordinateFilter = [params?.latitude, params?.longitude].every(
      (e) => e
    )
      ? `AND ST_Intersects(ST_Buffer(equipment."Location"::geometry,${params?.distance}),'POINT(${params?.latitude} ${params?.longitude})')`
      : "";

    const query = `
        WITH Stations AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."Enable",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."CreatedAt",
                          lastSync."completedon" as "LastSync",
                          equipment."UpdatedAt" ,
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType",
                          ST_AsGeoJSON(
                              equipment."Location"::geometry
          )::json AS "GeoLocation"
      FROM
                          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."LastUpdatedAt" AS lastSync
      ON lastSync."fk_organ" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = ${STATION_ID_TYPE} ${coordinateFilter})
      SELECT Stations.*, Measurements.* FROM Stations,
          LATERAL (
              SELECT
                  rs."FK_Equipment" ,
                  rs."Time",
                  rs."Hour",
                  TRUNC(rs."Et0"::numeric,2) AS "Et0"
              FROM
                  equipments."ReadStations" rs
              WHERE
                  rs."FK_Equipment" = Stations."Id"
              ORDER BY
                  rs."Time" DESC
              LIMIT ${MEASURES_ROWS}
          ) AS Measurements
    `;

    const data = await governmentDb.raw(query);

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
      distance?: number;
    } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null> {
    // TO-DO: filtrar só equipamentos que tenha dados do dia anterior
    const timeZone = 3;
    const withoutLocalTimezone = `(DATE_TRUNC('day', NOW()::date) - INTERVAL '${timeZone} hours')::date`;

    // TODO: Need to refactor to bind params
    const query = `
          WITH Pluviometers AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."Enable",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."CreatedAt",
                          equipment."UpdatedAt",
                          lastSync."completedon" as "LastSync",
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType",
                          ST_AsGeoJSON(
                              equipment."Location"::geometry
          )::json AS "GeoLocation"
      FROM
                          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."LastUpdatedAt" AS lastSync
      ON lastSync."fk_organ" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = 2  ${
        [params?.latitude, params?.longitude].every((e) => e)
          ? `AND ST_Intersects(ST_Buffer(equipment."Location"::geometry,${params?.distance}),'POINT(${params?.latitude} ${params?.longitude})')`
          : ""
      })
      SELECT Pluviometers.*, Measurements.* FROM Pluviometers,
          LATERAL (
              SELECT
                  rs."FK_Equipment" ,
                  rs."Time",
                  rs."Hour",
                  CASE WHEN rs."Value" >=0 THEN TRUNC(rs."Value"::numeric,2)
                  ELSE NULL  END AS "Value"
              FROM
                  equipments."ReadPluviometers" rs
              WHERE
                  rs."FK_Equipment" = Pluviometers."Id"
              ORDER BY
                  rs."Time" DESC
              LIMIT 1
          ) AS Measurements
    `;

    const data = await governmentDb.raw(query);

    if (!data.rows.length) {
      return null;
    }

    const rows = data.rows;

    const pluviometers: Array<PluviometerWithLastMeasurement> = rows.map(
      (row: any) => ({
        ...mapEquipmentToDomain(row),
        Precipitation: row.Value !== null ? Number(row.Value) : null,
      })
    );

    return pluviometers.length ? pluviometers : null;
  }
  async getEquipmentsByType(type: string) {
    const response = await governmentDb.raw(
      `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          ST_AsGeoJSON(
              equipment."Location"::geometry
          )::json AS "GeoLocation",
          eqp_type."Name" AS "Type",
          organ."Name" AS "Organ",
          organ."IdOrgan" AS "Organ_Id"
        FROM
          equipments."MetereologicalEquipment" equipment
        INNER JOIN equipments."EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN equipments."MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          eqp_type."Name" = ?
        `,
      [type]
    );

    const data = response.rows.map((eqp: any) => {
      const coordinates = eqp.GeoLocation
        ? eqp.GeoLocation["coordinates"]
        : null;
      return {
        Id: eqp.Id,
        Code: eqp.Code,
        Altitude: eqp.Altitude,
        Location:
          coordinates !== null
            ? {
                Latitude: coordinates[0],
                Longitude: coordinates[1],
              }
            : null,
        Type: eqp.Type,
        Organ: eqp.Organ,
        Id_Organ: eqp.Organ_Id,
      };
    });
    return data;
  }
  async getOrganByName(organName: string) {
    const result = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan", "Host", "User", "Password")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    if (result) {
      return {
        Id: result.IdOrgan,
        Host: result.Host,
        User: result.User,
        Password: result.Password,
      };
    }

    return null;
  }
}
