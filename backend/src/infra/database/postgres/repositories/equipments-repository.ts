import {
  CreateEquipmentParams,
  Equipment,
  EquipmentsRepositoryProtocol,
  GetMetereologicalOrgans,
  PluviometerRead,
  StationRead,
  UpdateEquipmentParams,
} from "../../../../domain/use-cases/_ports/repositories/equipments-repository";
import { equipments } from "../connection/knexfile";

export class KnexEquipmentsRepository implements EquipmentsRepositoryProtocol {
  private measuresLimitRow = 30;
  private equipmentsLimitRow = 90;

  async deleteEquipment(idEquipment: number): Promise<number> {
    return await equipments("MetereologicalEquipment")
      .where({ IdEquipment: idEquipment })
      .del();
  }

  async createEquipment(equipment: CreateEquipmentParams): Promise<number> {
    const rawResult = await equipments
      .insert({
        IdEquipmentExternal: equipment.IdEquipmentExternal,
        Name: equipment.Name,
        Altitude: equipment.Altitude,
        FK_Organ: equipment.Fk_Organ,
        FK_Type: equipment.Fk_Type,
        CreatedAt: equipments.fn.now(),
      })
      .returning("IdEquipment")
      .into("MetereologicalEquipment");

    const idEquipment = rawResult[0].IdEquipment;

    return Number(idEquipment);
  }

  async updateEquipment(equipment: UpdateEquipmentParams): Promise<void> {
    const rawResult = await equipments("MetereologicalEquipment")
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

    console.log("[updateEquipment] :: ", { rawResult });
  }

  async checkIfOrganExists(idOrgan: number): Promise<boolean> {
    const exists = await equipments
      .select("IdOrgan")
      .from("MetereologicalOrgan")
      .where({ IdOrgan: idOrgan })
      .first();

    return exists ? true : false;
  }

  async checkIfEquipmentTypeExists(idType: number): Promise<boolean> {
    const exists = await equipments
      .select("IdType")
      .from("EquipmentType")
      .where({ IdType: idType })
      .first();

    return exists ? true : false;
  }

  async getMetereologicalOrgans(): Promise<Array<GetMetereologicalOrgans> | null> {
    const data = await equipments
      .select("IdOrgan", "Name", "Host", "User")
      .from("MetereologicalOrgan");

    if (data.length === 0) {
      return null;
    }

    return data.map((raw) => {
      const { IdOrgan, Name, Host, User } = raw;

      return {
        IdOrgan: Number(IdOrgan),
        Name,
        Host,
        User,
      };
    });
  }
  async getEquipments(pageNumber: number): Promise<Array<Equipment> | null> {
    const data = await equipments.raw(`
      SELECT
          equipment."IdEquipment" AS "Id",
          equipment."IdEquipmentExternal"  AS "EqpCode",
          equipment."Name",
          equipment."Altitude" ,
          equipment."CreatedAt",
          equipment."UpdatedAt" ,
          organ."IdOrgan" AS "IdOrgan",
          organ."Name" AS "OrganName",
          eqpType."IdType" AS "IdType",
          eqpType."Name" AS "EqpType",
          eqpLocation."IdLocation" ,
          eqpLocation."Location" AS "Coordinates",
          eqpLocation."Name" AS "LocationName"
      FROM "MetereologicalEquipment" AS equipment
      INNER JOIN "MetereologicalOrgan" AS organ ON organ."IdOrgan" = equipment."FK_Organ"
      INNER JOIN "EquipmentType" eqpType ON eqpType."IdType"  = equipment."FK_Type"
      LEFT JOIN "EquipmentLocation" AS eqpLocation ON eqpLocation."FK_Equipment" = equipment."IdEquipment"
      LIMIT ${this.equipmentsLimitRow} OFFSET ${pageNumber}
    `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Id: Number(row.Id),
      Code: Number(row.EqpCode) || null,
      Name: row.Name,
      IdType: Number(row.IdType),
      Type: row.EqpType,
      Altitude: Number(row.Altitude) || null,
      IdOrgan: Number(row.IdOrgan),
      Organ: row.OrganName,
      IdLocation: Number(row.IdLocation),
      LocationPosition: row.Coordinates,
      LocationName: row.LocationName,
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
      PageNumber: pageNumber,
      QtdRows: data.rowCount,
    }));
  }
  async getStationsReads(
    idEquipment: number,
    pageNumber: number
  ): Promise<Array<StationRead> | null> {
    const limitRow = 60;

    const data = await equipments.raw(
      `
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
      WHERE stations."FK_Equipment" = ?
      ORDER BY "Time" ASC
      LIMIT ${this.measuresLimitRow} OFFSET ?;
  `,
      [idEquipment, pageNumber]
    );

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      IdRead: Number(row.IdRead) || null,
      Time: row.Time,
      Hour: row.Hour,
      IdEquipment: Number(row.IdEquipment) || null,
      Code: Number(row.EquipmentCode) || null,
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
  }
  async getPluviometersReads(
    idEquipment: number,
    pageNumber: number
  ): Promise<Array<PluviometerRead> | null> {
    const data = await equipments.raw(
      `
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
          "ReadPluviometers" AS pluviometer
      INNER JOIN "MetereologicalOrgan" AS organ
          ON
          organ."IdOrgan" = pluviometer."FK_Organ"
      INNER JOIN "MetereologicalEquipment" AS equipment
          ON
          equipment."IdEquipment" = pluviometer."FK_Equipment"
      WHERE pluviometer."FK_Equipment" = ?
      ORDER BY "Time" ASC
      LIMIT ${this.measuresLimitRow} OFFSET ?;
  `,
      [idEquipment, pageNumber]
    );

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      IdRead: Number(row.IdRead) || null,
      Time: row.Time,
      Hour: row.Hour,
      IdEquipment: Number(row.IdEquipment) || null,
      Code: Number(row.Code) || null,
      Name: row.Name,
      Organ: row.OrganName,
      Measures: {
        Precipitation: {
          Unit: "mm",
          Value: Number(row.Value) || null,
        },
      },
    }));
  }
}
