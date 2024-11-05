import { geoLocationExtension } from "./utils/geolocation";

import {
  governmentDb,
  logsDb,
} from "../../../../shared/infra/database/postgres/connection/knexfile";
import { countTotalRows } from "../../../../shared/infra/database/postgres/paginate";
import { PaginatedInput } from "../../../../shared/utils/command";
import {
  IOutputWithPagination,
  toPaginatedOutput
} from "../../../../shared/utils/pagination";
import { UserCommandOperationProps } from "../../../Logs/core/protocols/logger";
import {
  EquipmentEntity,
  PluviometerWithLastMeasurement,
  StationWithLastMeasurement,
} from "../../core/models/Equipment";
import { MeteorologicalOrganEntity } from "../../core/models/MetereologicalOrgan";
import { IEquipmentsRepository } from "./protocols/equipment";

export class EquipmentsRepository implements IEquipmentsRepository {
  async enableEquipment(
    equipment: { IdEquipment: number; Enable: boolean },
    operation: UserCommandOperationProps
  ): Promise<void> {
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

    await logsDb
      .insert({
        User_Id: operation.author,
        Resource: "equipment",
        Operation: "update",
        Description: operation.operation,
      })
      .withSchema("users")
      .into("Operations");
  }
  async deleteEquipment(idEquipment: number): Promise<number> {
    return await governmentDb("MetereologicalEquipment")
      .withSchema("equipments")
      .where({ IdEquipment: idEquipment })
      .del();
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
  async checkIfEquipmentTypeExists(idType: number): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdType")
      .from("EquipmentType")
      .where({ IdType: idType })
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
  async getEquipmentId(id: number): Promise<EquipmentEntity | null> {
    const result = await governmentDb.raw(
      `
    SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "EqpCode",
          equipment."Name",
          equipment."Altitude" ,
          equipment."Latitude" ,
          equipment."Longitude" ,
          equipment."CreatedAt",
          equipment."UpdatedAt" ,
          equipment."Enable",
          organ."IdOrgan" AS "IdOrgan",
          organ."Name" AS "OrganName",
          eqpType."IdType" AS "IdType",
          eqpType."Name" AS "EqpType"
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
        Coordinates: data.Latitude && data.Longitude ? [data.Longitude, data.Latitude] : null,
      },
      CreatedAt: data.CreatedAt,
      UpdatedAt: data.UpdatedAt,
      Enable: data.Enable,
    };
  }

  async getPluviometersWithYesterdayMeasurements(
    params: { latitude: number; longitude: number; distance?: number } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null> {
    // TO-DO: filtrar só equipamentos que tenha dados do dia anterior

    // TODO: Need to refactor to bind params
    const query = `
          WITH Pluviometers AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."Enable",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."Latitude" ,
                          equipment."Longitude" ,
                          equipment."CreatedAt",
                          equipment."UpdatedAt",
                          lastSync."completedon" as "LastSync",
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType"
      FROM
                          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."LastUpdatedAt" AS lastSync
      ON lastSync."fk_organ" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = 2 )
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

  async getStationsWithYesterdayMeasurements(
    params: { latitude: number; longitude: number; distance?: number } | null
  ): Promise<Array<StationWithLastMeasurement> | null> {
    const STATION_ID_TYPE = 1;
    const MEASURES_ROWS = 1;


    const query = `
        WITH Stations AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."Enable",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."Latitude" ,
                          equipment."Longitude" ,
                          equipment."CreatedAt",
                          lastSync."completedon" as "LastSync",
                          equipment."UpdatedAt" ,
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType"
      FROM
                          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."LastUpdatedAt" AS lastSync
      ON lastSync."fk_organ" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = ${STATION_ID_TYPE})
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

  async getActivatedStations(
    params: { latitude: number; longitude: number; distance?: number } | null
  ): Promise<Array<StationWithLastMeasurement> | null> {
    const STATION_ID_TYPE = 1;
    const MEASURES_ROWS = 1;



    const query = `
        WITH Stations AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."Enable",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."Latitude" ,
                          equipment."Longitude" ,
                          equipment."CreatedAt",
                          lastSync."completedon" as "LastSync",
                          equipment."UpdatedAt" ,
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType"
      FROM
                          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."LastUpdatedAt" AS lastSync
      ON lastSync."fk_organ" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = ${STATION_ID_TYPE} AND  equipment."Enable" = true
      AND equipment."Enable" = true
      )
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

  async getActivatedPluviometers(
    params: { latitude: number; longitude: number; distance?: number } | null
  ): Promise<Array<PluviometerWithLastMeasurement> | null> {
    // TO-DO: filtrar só equipamentos que tenha dados do dia anterior

    // TODO: Need to refactor to bind params
    const query = `
          WITH Pluviometers AS (SELECT
                          equipment."IdEquipment" AS "Id",
                          equipment."Enable",
                          equipment."IdEquipmentExternal" AS "EqpCode",
                          equipment."Name",
                          equipment."Altitude" ,
                          equipment."Latitude" ,
                          equipment."Longitude" ,
                          equipment."CreatedAt",
                          equipment."UpdatedAt",
                          lastSync."completedon" as "LastSync",
                          organ."IdOrgan" AS "IdOrgan",
                          organ."Name" AS "OrganName",
                          eqpType."IdType" AS "IdType",
                          eqpType."Name" AS "EqpType"
      FROM
                          equipments."MetereologicalEquipment" AS equipment
      INNER JOIN equipments."MetereologicalOrgan" AS organ ON
                          organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN equipments."LastUpdatedAt" AS lastSync
      ON lastSync."fk_organ" = equipment."FK_Organ"
      INNER JOIN equipments."EquipmentType" eqpType ON
                          eqpType."IdType" = equipment."FK_Type"
      WHERE equipment."FK_Type" = 2  AND  equipment."Enable" = true)
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

  async checkIfOrganNameAlreadyExists(organName: string): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    return exists ? true : false;
  }
  async checkIfOrganExists(idOrgan: number): Promise<boolean> {
    const exists = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ IdOrgan: idOrgan })
      .first();

    return exists ? true : false;
  }
  async getMeteorologicalOrgans(): Promise<Array<
    Omit<MeteorologicalOrganEntity, "Password">
  > | null> {
    const data = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan", "Name")
      .from("MetereologicalOrgan");

    if (data.length === 0) {
      return null;
    }

    return data.map((raw) => {
      const { IdOrgan, Name } = raw;

      return {
        Id: Number(IdOrgan),
        Name,
      };
    });
  }

  async insertLastUpdatedAtByOrgan(organId: number) {
    await governmentDb.raw(
      `
        INSERT
            INTO
            equipments."LastUpdatedAt" (
                fk_organ,
                completedon
            )
        VALUES
            (
              ?,
              NOW()
            )
        ON
        CONFLICT (fk_organ)
        DO
        UPDATE
        SET
            completedon = NOW();
    `,
      [organId]
    );
  }

  async getDateOfLastMeasurementTaken(): Promise<null | Array<{
    Time: string;
    Id_Organ: number;
  }>> {
    const meteorologicalOrganIds = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan")
      .from("MetereologicalOrgan");

    if (meteorologicalOrganIds.length) {
      const organsIds = meteorologicalOrganIds.map((item) => item.IdOrgan);

      const response = await governmentDb
        .withSchema("equipments")
        .select("*")
        .from("LastUpdatedAt")
        .whereIn("fk_organ", organsIds);

      if (!response) {
        return null;
      }

      return response.map((item) => ({
        Time: item.completedon,
        Id_Organ: item.fk_organ,
      }));
    }
    return null;
  }
  async getTypes(): Promise<
    Array<{
      Type: string;
      Name: number;
    }>
  > {
    let types: Array<{
      Type: string;
      Name: number;
    }> = [];

    const response = await governmentDb
      .withSchema("equipments")
      .select("IdType", "Name")
      .from("EquipmentType");

    types = response.map((raw: any) => ({
      Type: raw.IdType,
      Name: raw.Name,
    }));

    return types;
  }
  async getOrganByName(organName: string): Promise<{
    Id: number;
  } | null> {
    const response = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    if (response) {
      return {
        Id: response.IdOrgan,
      };
    }

    return null;
  }

  async getByType(type: string): Promise<
    Array<{
      IdEquipmentExternal: string;
      Name: string;
      Altitude: number | null;
      Location: {
        Latitude: number;
        Longitude: number;
      } | null;
      FK_Organ: number;
      FK_Type: number;
      Enabled: number;
    }>
  > {
    const response = await governmentDb.raw(
      `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          equipment."Latitude",
          equipment."Longitude",
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
      return {
        Id: eqp.Id,
        Code: eqp.Code,
        Altitude: eqp.Altitude,
        Location:
          eqp.Latitude && eqp.Longitude
            ? {
              Latitude: eqp.Latitude,
              Longitude: eqp.Longitude,
            }
            : null,
        Type: eqp.Type,
        Organ: eqp.Organ,
        Id_Organ: eqp.Organ_Id,
      };
    });
    return data;
  }

  async bulkInsert(
    equipments: Array<any>
  ): Promise<Array<{ Code: string; Id: number }>> {
    const insertedEquipments: Array<{ Code: string; Id: number }> = [];


    await governmentDb.transaction(async (trx) => {
      // TO-DO: how insert coordinates?
      // TO-DO: how measurements?
      // Location (Latitude, Longitude)
      const toPersistency = equipments.map((equipment: any) => {
        return {
          IdEquipmentExternal: equipment.IdEquipmentExternal,
          Name: equipment.Name,
          Altitude: equipment.Altitude,
          Latitude: Number(equipment.Location.Latitude),
          Longitude: Number(equipment.Location.Longitude),
          FK_Organ: equipment.FK_Organ,
          FK_Type: equipment.FK_Type,
          Enable: equipment.Enabled,
          CreatedAt: governmentDb.fn.now(),
        };
      });

      const eqps = await trx
        .batchInsert<any>("equipments.MetereologicalEquipment", toPersistency)
        .returning(["IdEquipment", "IdEquipmentExternal"]);

      // [ { IdEquipment: 1 }, { IdEquipment: 2 } ]
      eqps.forEach((eqp) => {
        // insertedEquipments.set(eqp.IdEquipmentExternal, eqp.IdEquipment)
        insertedEquipments.push({
          Code: eqp.IdEquipmentExternal,
          Id: eqp.IdEquipment,
        });
      });
    });

    return insertedEquipments;
  }

  async getStationCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ): Promise<any> {
    const result = await governmentDb
      .withSchema("equipments")
      .select("MetereologicalEquipment.IdEquipmentExternal")
      .from("ReadStations")
      .innerJoin(
        "MetereologicalEquipment",
        "MetereologicalEquipment.IdEquipment",
        "ReadStations.FK_Equipment"
      )
      //@ts-ignore
      .whereIn({ IdEquipmentExternal: equipmentsCodes })
      .andWhere({ Time: time });

    const equipmentsWithMeasures = new Set();

    if (result.length) {
      result.forEach((eqp) => {
        const { IdEquipmentExternal } = eqp;

        equipmentsWithMeasures.add(IdEquipmentExternal);
      });
    }

    return equipmentsWithMeasures;
  }

  async getPluviometersCodesWithMeasurements(
    equipmentsCodes: Array<string>,
    time: string
  ) {
    const result = await governmentDb
      .withSchema("equipments")
      .select("MetereologicalEquipment.IdEquipmentExternal")
      .from("ReadPluviometers")
      .innerJoin(
        "MetereologicalEquipment",
        "MetereologicalEquipment.IdEquipment",
        "ReadPluviometers.FK_Equipment"
      )
      //@ts-ignore
      .whereIn({ IdEquipmentExternal: equipmentsCodes })
      .andWhere({ Time: time });

    const equipmentsWithMeasures = new Set();

    if (result.length) {
      result.forEach((eqp) => {
        const { IdEquipmentExternal } = eqp;

        equipmentsWithMeasures.add(IdEquipmentExternal);
      });
    }

    return equipmentsWithMeasures;
  }

  async getAllByType(organName: string, eqpType: string): Promise<any> {
    let equipments = [];

    if (organName) {
      equipments = await governmentDb.raw(
        `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          equipment."Latitude",
          equipment."Longitude",
          eqp_type."Name" AS "Type",
          organ."Name" AS "Organ",
          organ."IdOrgan" AS "Organ_Id"
        FROM
          equipments."MetereologicalEquipment" equipment
        INNER JOIN equipments."EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN equipments."MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          organ."Name" = ? AND eqp_type."Name" = ?
        `,
        [organName, eqpType]
      );
    } else {
      equipments = await governmentDb.raw(
        `
        SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal" AS "Code",
          equipment."Name" AS "Location",
          equipment."Altitude",
          equipment."Latitude",
          equipment."Longitude",
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
        [eqpType]
      );
    }

    return equipments.rows.map((eqp: any) => {
      return {
        Id: eqp.Id,
        Code: eqp.Code,
        Altitude: eqp.Altitude,
        Location:
          eqp.Latitude && eqp.Longitude
            ? {
              Latitude: eqp.Latitude,
              Longitude: eqp.Longitude,
            }
            : null,
        Type: eqp.Type,
        Organ: eqp.Organ,
        Id_Organ: eqp.Organ_Id,
      };
    });
  }

  private typeIsStation(id_type: number) {
    return id_type == 1;
  }

  async getAll(
    params: PaginatedInput<{
      equipmentId?: number;
      idOrgan?: number;
      idType?: number;
      name?: string;
      enabled?: boolean;
      only_with_measurements?: boolean;
    }>
  ): Promise<IOutputWithPagination<EquipmentEntity>> {
    const {
      idOrgan,
      idType,
      name,
      only_with_measurements,
      enabled,
    } = params.data;

    const {
      pageNumber,
      limit,
      offset,

    } = params.paginate;
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

    if (enabled !== undefined) {
      if (queries.length) {
        queries.push(`AND
        equipment."Enable" = ?`);
      } else {
        queries.push(`WHERE
        equipment."Enable" = ?`);
      }

      binding.push(enabled);
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
            rs."Et0" >= 0
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
                rp."Value" >= 0
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
                    equipment."Latitude",
                    equipment."Longitude",
                    lastSync."completedon" as "LastSync",
                    organ."IdOrgan" AS "IdOrgan",
                    organ."Name" AS "OrganName",
                    eqpType."IdType" AS "IdType",
                    eqpType."Name" AS "EqpType"
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
}

function mapEquipmentToDomain(row: any) {
  let Coordinates = null;
  // Convert (longitude,latitude) to (latitude,longitude)
  if (row.Latitude && row.Longitude) {
    const { Latitude, Longitude } = row;

    Coordinates = [Longitude, Latitude];
  }
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
      Coordinates,
    },
    LastSync: row.LastSync,
  };
}
