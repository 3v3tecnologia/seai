import { geoLocationExtension } from "./utils/geolocation";
import { governmentDb } from "../../../infra/database/postgres/connection/knexfile";
import { IEquipmentsRepository } from "./protocols/equipment";

export class EquipmentsRepository implements IEquipmentsRepository {
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
    Host: string | null;
    User: string | null;
    Password: string | null;
  } | null> {
    const response = await governmentDb
      .withSchema("equipments")
      .select("IdOrgan", "Host", "User", "Password")
      .from("MetereologicalOrgan")
      .where({ Name: organName })
      .first();

    if (response) {
      return {
        Id: response.IdOrgan,
        Host: response.Host,
        User: response.User,
        Password: response.Password,
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

  async bulkInsert(
    equipments: Array<any>
  ): Promise<Array<{ Code: string; Id: number }>> {
    const insertedEquipments: Array<{ Code: string; Id: number }> = [];

    const st = geoLocationExtension(governmentDb);

    await governmentDb.transaction(async (trx) => {
      // TO-DO: how insert coordinates?
      // TO-DO: how measurements?
      const toPersistency = equipments.map((equipment: any) => {
        return {
          IdEquipmentExternal: equipment.IdEquipmentExternal,
          Name: equipment.Name,
          Altitude: equipment.Altitude,
          // Location: st.geomFromText("Point(-71.064544 44.28787)"),
          Location: st.geomFromText(
            `Point(${equipment.Location.Latitude} ${equipment.Location.Longitude})`
          ),
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

  async getEquipments(organName: string, eqpType: string): Promise<any> {
    let equipments = [];

    if (organName) {
      equipments = await governmentDb.raw(
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
        [eqpType]
      );
    }

    return equipments.rows.map((eqp: any) => {
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
  }
}
