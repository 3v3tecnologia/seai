import { governmentDb } from "../../../infra/database/postgres/connection/knexfile";
import { IrrigationSystemTypes } from "../core/model/irrigation-system";

// Como é no banco (Trocar para portugues)
// enum IrrigationSystemTypes {
//     'Sprinkling',
//     'MicroSprinkling',
//     'Pivot',
//     'Dripping',
//     'Furrow'
// }

export type IrrigationCropsData = {
  id?: number;
  user_id: number;
  crop_id: number;
  planting_date: string;
  system_type: IrrigationSystemTypes;
  area?: number;
  effective_area?: number;
  plants_qtd?: number;
  sprinkler_precipitation?: number;
  length?: number;
  spacing?: number;
  flow?: number;
};

function mapIrrigationCropsToDomain(row: any): {
  id: number;
  // user_id: number,
  station_id: number;
  system_type: IrrigationSystemTypes;
  crop_id: number;
  crop_name: string;
  planting_date: string;
  ETo: number | null;
  pluviometer_id: number;
  pluviometry: number | null;
  area?: number | null;
  effective_area?: number | null;
  plants_qtd?: number | null;
  sprinkler_precipitation?: number | null;
  length?: number | null;
  spacing?: number | null;
  flow?: number | null;
  created_at: string;
  updated_at?: string | null;
} {
  const {
    id,
    planting_date,
    flow,
    system_type,
    area,
    effective_area,
    plants_qtd,
    sprinkler_precipitation,
    length,
    spacing,
    created_at,
    updated_at,
    crop_id,
    crop_name,
    station_id,
    ETo,
    pluviometer_id,
    pluviometry,
  } = row;

  return {
    id: Number(id),
    crop_id: Number(crop_id),
    system_type: system_type as IrrigationSystemTypes,
    planting_date,
    crop_name,
    station_id: Number(station_id),
    ETo: ETo ? Number(ETo) : null,
    pluviometer_id: Number(pluviometer_id),
    pluviometry: pluviometry ? Number(pluviometry) : null,
    flow: flow ? Number(flow) : null,
    area: area ? Number(area) : null,
    effective_area: effective_area ? Number(effective_area) : null,
    plants_qtd: plants_qtd ? Number(plants_qtd) : null,
    sprinkler_precipitation: sprinkler_precipitation
      ? Number(sprinkler_precipitation)
      : null,
    length: length ? Number(length) : null,
    spacing: spacing ? Number(spacing) : null,
    created_at,
    updated_at,
  };
}

export class IrrigationCropsRepository {
  static async save(params: IrrigationCropsData): Promise<number | null> {
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

  // Delete all
  static async deleteByUserId(user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        user_id,
      })
      .from("Irrigation_Crops");
  }

  static async deleteById(id: number, user_id: number): Promise<void> {
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

  static async update(params: Required<IrrigationCropsData>): Promise<void> {
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

  static async getByUserId(user_id: number): Promise<Array<{
    id: number;
    // user_id: number,
    station_id: number;
    system_type: string;
    crop_id: number;
    crop_name: string;
    planting_date: string;
    ETo: number | null;
    pluviometer_id: number;
    pluviometry: number | null;
    area?: number | null;
    effective_area?: number | null;
    plants_qtd?: number | null;
    sprinkler_precipitation?: number | null;
    length?: number | null;
    spacing?: number | null;
    flow?: number | null;
    created_at: string;
    updated_at?: string | null;
  }> | null> {
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

  static async getById(
    id: number,
    user_id: number
  ): Promise<{
    id: number;
    // user_id: number,
    station_id: number;
    system_type: string;
    crop_id: number;
    crop_name: string;
    planting_date: string;
    ETo: number | null;
    pluviometer_id: number;
    pluviometry: number | null;
    area?: number | null;
    effective_area?: number | null;
    plants_qtd?: number | null;
    sprinkler_precipitation?: number | null;
    length?: number | null;
    spacing?: number | null;
    flow?: number | null;
    created_at: string;
    updated_at?: string | null;
  } | null> {
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
}
