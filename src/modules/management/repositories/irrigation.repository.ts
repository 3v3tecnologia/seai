import { governmentDb } from "../../../infra/database/postgres/connection/knexfile";
import { mapIrrigationCropsToDomain } from "../core/mappers/irrigation-crops";
import {
  IIrrigationRepository,
  IrrigationCropsData,
  IUserRecordedRecommendationData,
} from "./protocols/irrigation.repository";

export class IrrigationCropsRepository implements IIrrigationRepository {
  async save(params: IrrigationCropsData): Promise<number | null> {
    const {
      area,
      crop_id,
      effective_area,
      flow,
      length,
      planting_date,
      plants_qtd,
      spacing,
      sprinkler_precipitation,
      system_type,
      user_id,
    } = params;

    const response = await governmentDb
      .withSchema("management")
      .insert({
        area,
        crop_id,
        effective_area,
        flow,
        length,
        planting_date,
        plants_qtd,
        spacing,
        sprinkler_precipitation,
        system_type,
        user_id,
      })
      .returning("id")
      .into("Irrigation_Crops");

    return response.length ? response[0]?.id : null;
  }

  async deleteByUserId(user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        user_id,
      })
      .from("Irrigation_Crops");
  }

  async deleteById(id: number, user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        id,
      })
      .andWhere({
        user_id,
      })
      .from("Irrigation_Crops");
  }

  async update(params: Required<IrrigationCropsData>): Promise<void> {
    const {
      id,
      area,
      crop_id,
      effective_area,
      flow,
      length,
      planting_date,
      plants_qtd,
      spacing,
      sprinkler_precipitation,
      system_type,
      user_id,
    } = params;

    await governmentDb
      .withSchema("management")
      .update({
        area,
        crop_id,
        effective_area,
        flow,
        length,
        planting_date,
        plants_qtd,
        spacing,
        sprinkler_precipitation,
        system_type,
      })
      .where({
        id,
      })
      .andWhere({
        user_id,
      })
      .from("Irrigation_Crops");
  }

  async getByUserId(
    user_id: number
  ): Promise<Array<IUserRecordedRecommendationData> | null> {
    // Join with MeteorologicalEquipments
    // Join with Crops
    const dbResponse = await governmentDb.raw(
      `
            SELECT
                irrigation.id ,
                irrigation.planting_date,
                irrigation.flow,
                irrigation.system_type,
                irrigation.area ,
                irrigation.effective_area ,
                irrigation.plants_qtd ,
                irrigation.sprinkler_precipitation ,
                irrigation.length ,
                irrigation.spacing ,
                irrigation.created_at  ,
                irrigation.updated_at  ,
                crop."Id" AS "crop_id",
                crop."Name" AS "crop_name",
                user_eqps.station_id,
                (SELECT rs."Et0"  FROM government.equipments."ReadStations" rs
            WHERE rs."FK_Equipment" = user_eqps.station_id
            AND rs."Time" = (DATE_TRUNC('day', NOW()::date) - INTERVAL '3 hours')::date) AS "ETo",
                user_eqps.pluviometer_id,
                (SELECT COALESCE(rp."Value", 0)  FROM government.equipments."ReadPluviometers" rp
            WHERE rp."FK_Equipment" = user_eqps.pluviometer_id
            AND rp."Time" = (DATE_TRUNC('day', NOW()::date) - INTERVAL '3 hours')::date) AS "pluviometry"
            FROM
                management."Irrigation_Crops" irrigation
            INNER JOIN management."Crop" crop
            ON
                irrigation.crop_id = crop."Id"
            INNER JOIN management."User_Equipments" user_eqps
            ON
                user_eqps.user_id = irrigation.user_id
            WHERE irrigation.user_id  = ?
            `,
      [user_id]
    );

    const data = dbResponse.rows;

    if (!data.length) {
      return null;
    }

    return data.map(mapIrrigationCropsToDomain);
  }

  async getById(
    id: number,
    user_id: number
  ): Promise<IUserRecordedRecommendationData | null> {
    // Join with MeteorologicalEquipments
    // Join with Crops
    const dbResponse = await governmentDb.raw(
      `
            SELECT
                irrigation.id ,
                irrigation.planting_date,
                irrigation.flow,
                irrigation.system_type,
                irrigation.area ,
                irrigation.effective_area ,
                irrigation.plants_qtd ,
                irrigation.sprinkler_precipitation ,
                irrigation.length ,
                irrigation.spacing ,
                irrigation.created_at  ,
                irrigation.updated_at  ,
                crop."Id" AS "crop_id",
                crop."Name" AS "crop_name",
                user_eqps.station_id,
                (SELECT rs."Et0"  FROM government.equipments."ReadStations" rs
            WHERE rs."FK_Equipment" = user_eqps.station_id
            AND rs."Time" = (DATE_TRUNC('day', NOW()::date) - INTERVAL '3 hours')::date) AS "ETo",
                user_eqps.pluviometer_id,
                (SELECT rp."Value"  FROM government.equipments."ReadPluviometers" rp
            WHERE rp."FK_Equipment" = user_eqps.pluviometer_id
            AND rp."Time" = (DATE_TRUNC('day', NOW()::date) - INTERVAL '3 hours')::date) AS "pluviometry"
            FROM
                management."Irrigation_Crops" irrigation
            INNER JOIN management."Crop" crop
            ON
                irrigation.crop_id = crop."Id"
            INNER JOIN management."User_Equipments" user_eqps
            ON
                user_eqps.user_id = irrigation.user_id
            WHERE irrigation.user_id  = ? AND irrigation.id = ?
            `,
      [user_id, id]
    );

    const data = dbResponse.rows;

    if (!data.length) {
      return null;
    }

    return mapIrrigationCropsToDomain(data[0]);
  }

  async getUsersWithIrrigationReportsEnabled(): Promise<Array<{
    Id: number;
    Name: string;
    Email: string;
  }> | null> {
    const dbResponse = await governmentDb
      .withSchema("users")
      .select("Id", "Name", "Email")
      .where({
        Type: "irrigant",
      })
      .andWhere({
        Status: "registered",
      })
      .from("User");

    if (!dbResponse.length) {
      return null;
    }

    return dbResponse.map((row: any) => {
      return {
        Id: row.Id,
        Name: row.Name,
        Email: row.Email,
      };
    });
  }
}
