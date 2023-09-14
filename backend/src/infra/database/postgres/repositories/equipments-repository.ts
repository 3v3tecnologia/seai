import {
  Equipment,
  EquipmentsRepositoryProtocol,
  PluviometerRead,
  StationRead,
} from "../../../../domain/use-cases/_ports/repositories/equipments-repository";
import { equipments } from "../connection/knexfile";

export class KnexEquipmentsRepository implements EquipmentsRepositoryProtocol {
  async getEquipments(): Promise<Array<Equipment> | null> {
    const data = await equipments.raw(`
      SELECT
          EQP."IdEquipment" AS "Id",
          EQP."IdEquipmentExternal" AS "Code",
          EQP."Name",
          EQP_TYPE."Name" AS "Type",
          EQP."Altitude",
          ORGAN."Name" AS "Organ",
          EQP_LOCATION."Location" AS "LocationPosition",
          EQP_LOCATION."Name" AS "LocationName",
          EQP."CreatedAt",
          EQP."UpdatedAt"
      FROM
          "MetereologicalEquipment" AS EQP
      INNER JOIN "MetereologicalOrgan" AS ORGAN
      ON
          ORGAN."IdOrgan" = EQP."FK_Organ"
      INNER JOIN "EquipmentType" AS EQP_TYPE
      ON
          EQP_TYPE."IdType" = EQP."FK_Type"
      LEFT JOIN "EquipmentLocation" AS EQP_LOCATION
      ON
          EQP_LOCATION."FK_Equipment" = EQP."IdEquipment"
    `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Id: row.Id,
      Code: Number(row.Code) || null,
      Name: row.Name,
      Type: row.Type,
      Altitude: Number(row.Altitude) || null,
      Organ: row.Organ,
      LocationPosition: row.LocationPosition,
      LocationName: row.LocationName,
      CreatedAt: row.CreatedAt,
      UpdatedAt: row.UpdatedAt,
    }));
  }
  async getStationsReads(): Promise<Array<StationRead> | null> {
    const data = await equipments.raw(`
      SELECT
          STATIONS."Time" AS "Date",
          STATIONS."IdRead",
          EQP."IdEquipment",
          EQP."IdEquipmentExternal" AS "Code",
          EQP."Name",
          STATIONS."TotalRadiation",
          STATIONS."RelativeHumidity",
          STATIONS."AtmosphericTemperature",
          STATIONS."WindVelocity",
          ETO."Value" AS "Eto"
      FROM
          "ReadStations" AS STATIONS
      LEFT JOIN "Et0" AS ETO
      ON
          ETO."FK_Station_Read" = STATIONS."IdRead"
      INNER JOIN "MetereologicalEquipment" AS EQP
      ON
          EQP."IdEquipment" = STATIONS."FK_Equipment"
      ORDER BY STATIONS."Time" ASC
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Date: row.Date,
      IdRead: Number(row.IdRead) || null,
      IdEquipment: Number(row.IdEquipment) || null,
      Code: Number(row.Code) || null,
      Name: row.Name,
      Measures: {
        TotalRadiation: {
          Unit: "W/m",
          Value: Number(row.TotalRadiation) || null,
        },
        RelativeHumidity: {
          Unit: "%",
          Value: Number(row.RelativeHumidity) || null,
        },
        AtmosphericTemperature: {
          Unit: "°C",
          Value: Number(row.AtmosphericTemperature) || null,
        },
        WindVelocity: {
          Unit: "m/s",
          Value: Number(row.WindVelocity) || null,
        },
        ETO: {
          Unit: "mm/day",
          Value: Number(row.Eto) || null,
        },
      },
    }));
  }
  async getPluviometersReads(): Promise<Array<PluviometerRead> | null> {
    const data = await equipments.raw(`
      SELECT
          PLUVIOMETERS."Time" as "Date",
          PLUVIOMETERS."IdRead" ,
          EQP."IdEquipment",
          EQP."IdEquipmentExternal" AS "Code",
          EQP."Name",
          PLUVIOMETERS."Value" AS "Precipitation"
      FROM
          "ReadPluviometers" AS PLUVIOMETERS
      INNER JOIN "MetereologicalEquipment" AS EQP
      ON
          EQP."IdEquipment" = PLUVIOMETERS."FK_Equipment"
      ORDER BY PLUVIOMETERS."Time" ASC
  `);

    if (!data.rowCount) {
      return null;
    }

    return data.rows.map((row: any) => ({
      Date: row.Date,
      IdRead: Number(row.IdRead) || null,
      IdEquipment: Number(row.IdEquipment) || null,
      Code: Number(row.Code) || null,
      Name: row.Name,
      Measures: {
        Precipitation: {
          Unit: "mm",
          Value: Number(row.Precipitation) || null,
        },
      },
    }));
  }
}
