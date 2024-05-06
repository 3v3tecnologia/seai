import { equipmentsDb } from "../connections/db";
import { geoLocationExtension } from "../utils/geolocation";

export class DbEquipmentsRepository {
  static async getDateOfLastMeasurementTaken(): Promise<null | Array<{ Time: string, Id_Organ: number }>> {
    const meteorologicalOrganIds = await equipmentsDb.select("IdOrgan")
      .from("MetereologicalOrgan")

    if (meteorologicalOrganIds.length) {
      const organsIds = meteorologicalOrganIds.map(item => item.IdOrgan)

      const response = await equipmentsDb
        .select("*")
        .from("LastUpdateDate")
        .whereIn("fk_organ", organsIds)

      if (!response) {
        return null;
      }

      return response.map((item) => ({
        Time: item.completedon,
        Id_Organ: item.fk_organ,
      }))
    }
    return null
  }
  static async getTypes(): Promise<Array<{
    Type: string,
    Name: number
  }>> {
    let types: Array<{
      Type: string,
      Name: number
    }> = []

    const response = await equipmentsDb
      .select("IdType", "Name")
      .from("EquipmentType");


    types = response.map((raw: any) => ({
      Type: raw.IdType,
      Name: raw.Name
    }))

    return types;
  }
  static async getOrganByName(organName: string): Promise<{
    Id: number,
    Host: string | null,
    User: string | null,
    Password: string | null
  } | null> {
    const response = await equipmentsDb
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

  static async getByType(type: string): Promise<Array<{
    IdEquipmentExternal: string,
    Name: string,
    Altitude: number | null,
    Location: {
      Latitude: number,
      Longitude: number
    } | null,
    FK_Organ: number,
    FK_Type: number,
    Enabled: number
  }>> {
    const response = await equipmentsDb.raw(
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
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
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
    return data
  }

  static async bulkInsert(equipments: Array<any>): Promise<Array<{ Code: string, Id: number }>> {
    const insertedEquipments: Array<{ Code: string, Id: number }> = [];

    const st = geoLocationExtension(equipmentsDb);

    await equipmentsDb.transaction(async (trx) => {
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
          CreatedAt: equipmentsDb.fn.now(),
        };
      })

      const eqps = await trx
        .batchInsert<any>(
          "MetereologicalEquipment",
          toPersistency
        )
        .returning(["IdEquipment", "IdEquipmentExternal"]);

      // [ { IdEquipment: 1 }, { IdEquipment: 2 } ]
      eqps.forEach((eqp) => {
        // insertedEquipments.set(eqp.IdEquipmentExternal, eqp.IdEquipment)
        insertedEquipments.push({
          Code: eqp.IdEquipmentExternal,
          Id: eqp.IdEquipment
        })
      }
      );
    });

    return insertedEquipments;
  }

  static async getStationCodesWithMeasurements(equipmentsCodes = [], time: string) {

    const result = await equipmentsDb
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

    console.log("[getStationCodesWithMeasurements] ", result);

    if (result.length) {
      result.forEach((eqp) => {
        const { IdEquipmentExternal } = eqp;

        equipmentsWithMeasures.add(IdEquipmentExternal);
      });
    }

    return equipmentsWithMeasures;
  }

  static async getPluviometersCodesWithMeasurements(equipmentsCodes = [], time: string) {
    const result = await equipmentsDb
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

  static async getEquipments({ organName = null, eqpType = "" }) {
    let equipments = [];

    if (organName) {
      equipments = await equipmentsDb.raw(
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
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
        WHERE
          organ."Name" = ? AND eqp_type."Name" = ?
        `,
        [organName, eqpType]
      );
    } else {
      equipments = await equipmentsDb.raw(
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
          "MetereologicalEquipment" equipment
        INNER JOIN "EquipmentType" eqp_type ON eqp_type."IdType" = equipment."FK_Type"
        INNER JOIN "MetereologicalOrgan" organ ON organ."IdOrgan" = equipment."FK_Organ"
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
