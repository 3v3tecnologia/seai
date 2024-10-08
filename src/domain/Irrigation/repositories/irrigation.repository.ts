import { governmentDb } from "../../../shared/infra/database/postgres/connection/knexfile";
import { formatDateToYYYYMMDD } from "../../../shared/utils/date";
import { IrrigationSystemTypes } from "../core/model/irrigation-system";
import { IIrrigationRepository, IrrigationCropsData, IUserRecordedRecommendationData } from "./protocols/irrigation.repository";


function mapIrrigationCropsToDomain(row: any): IUserRecordedRecommendationData {
  const {
    id,
    name,
    planting_date,
    flow,
    system_type,
    area,
    effective_area,
    quantity,
    sprinkler_precipitation,
    length,
    spacing,
    created_at,
    updated_at,
    crop_id,
    crop_name,
    crop_deleted_at,
    station_id,
    ETo,
    pluviometer_id,
    pluviometry,
    time
  } = row;

  const irrigation_recommendation = {
    Id: Number(id),
    Name: name,
    CropId: null,
    Crop: null,
    SystemType: system_type as IrrigationSystemTypes,
    PlantingDate: planting_date,
    StationId: Number(station_id),
    ETo: ETo ? Number(ETo) : null,
    PluviometerId: Number(pluviometer_id),
    Pluviometry: pluviometry ? Number(pluviometry) : null,
    Flow: flow ? Number(flow) : null,
    Area: area ? Number(area) : null,
    Time: time ? Number(time) : null,
    EffectiveArea: effective_area ? Number(effective_area) : null,
    Quantity: quantity ? Number(quantity) : null,
    System_Precipitation: sprinkler_precipitation
      ? Number(sprinkler_precipitation)
      : null,
    Length: length ? Number(length) : null,
    Spacing: spacing ? Number(spacing) : null,
    CreatedAt: created_at,
    UpdatedAt: updated_at,
  }

  if (crop_deleted_at === null) {
    Object.assign(irrigation_recommendation, {
      CropId: Number(crop_id),
      Crop: crop_name,
    })
  }

  return irrigation_recommendation
}

export class IrrigationCropsRepository implements IIrrigationRepository {
  async save(params: IrrigationCropsData): Promise<number | null> {
    const {
      area,
      name,
      crop_id,
      effective_area,
      flow,
      length,
      planting_date,
      quantity,
      spacing,
      sprinkler_precipitation,
      system_type,
      user_id,
    } = params;

    const data = {
      area,
      name,
      crop_id,
      effective_area,
      flow,
      length,
      planting_date: formatDateToYYYYMMDD(planting_date),
      quantity,
      spacing,
      sprinkler_precipitation,
      system_type,
    }

    if (params.time) {
      // Tempo “T” em horas e minutos para uma volta (Pivô)
      Object.assign(data, {
        time: params.time
      })
    }

    const response = await governmentDb
      .withSchema("management")
      .insert(data)
      .returning("id")
      .into("Irrigation_Crops");

    const irrigation_crops_id = response.length ? response[0]?.id : null;

    if (irrigation_crops_id) {
      await governmentDb
        .withSchema("management")
        .insert({
          user_id,
          irrigation_crops_id,
        })
        .returning("id")
        .into("User_Irrigation_Crops");
    }

    return irrigation_crops_id;
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
    // TO-DO : check if crop was deleted
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        irrigation_crops_id: id,
      })
      .andWhere({
        user_id,
      })
      .from("User_Irrigation_Crops");

    await governmentDb
      .withSchema("management")
      .del()
      .where({
        id,
      })
      .from("Irrigation_Crops");
  }
  async update(params: IrrigationCropsData): Promise<void> {
    const {
      id,
      area,
      name,
      crop_id,
      effective_area,
      flow,
      length,
      planting_date,
      quantity,
      spacing,
      sprinkler_precipitation,
      system_type,
    } = params;

    // TO-DO : check if crop was deleted
    const data = {
      area,
      name,
      crop_id,
      effective_area,
      flow,
      length,
      planting_date: formatDateToYYYYMMDD(planting_date),
      quantity,
      spacing,
      sprinkler_precipitation,
      system_type,
    }


    if (params.time) {
      // Tempo “T” em horas e minutos para uma volta (Pivô)
      Object.assign(data, {
        time: params.time
      })
    }

    await governmentDb
      .withSchema("management")
      .update(data)
      .where({
        id,
      })
      .from("Irrigation_Crops");

  }
  async getByUserId(
    user_id: number
  ): Promise<Array<IUserRecordedRecommendationData> | null> {
    const dbResponse = await governmentDb.raw(
      `
            SELECT
                irrigation.id ,
                user_irrigations.user_id,
                irrigation."name" ,
                irrigation.planting_date ,
                irrigation.crop_id ,
                irrigation.system_type ,
                irrigation.area ,
                irrigation.effective_area ,
                irrigation.quantity ,
                irrigation.sprinkler_precipitation ,
                irrigation.length ,
                irrigation.spacing ,
                irrigation.flow ,
                irrigation.time ,
                crop."Id" AS "crop_id",
                crop."Name" AS "crop_name",
                crop."Deleted_At" as "crop_deleted_at",
                user_eqps.station_id,
                (
                    SELECT
                        rs."Et0"
                    FROM
                        government.equipments."ReadStations" rs
                    WHERE
                        rs."FK_Equipment" = user_eqps.station_id
                        AND rs."Time" = (
                            DATE_TRUNC(
                                'day',
                                NOW()::date
                            ) - INTERVAL '3 hours'
                        )::date
                ) AS "ETo",
                user_eqps.pluviometer_id,
                (
                    SELECT
                        COALESCE(
                            rp."Value",
                            0
                        )
                    FROM
                        government.equipments."ReadPluviometers" rp
                    WHERE
                        rp."FK_Equipment" = user_eqps.pluviometer_id
                        AND rp."Time" = (
                            DATE_TRUNC(
                                'day',
                                NOW()::date
                            ) - INTERVAL '3 hours'
                        )::date
                ) AS "pluviometry",
                user_irrigations.created_at,
                user_irrigations.updated_at
            FROM (SELECT * FROM management."User_Irrigation_Crops" uic
            WHERE uic.user_id  = ? AND uic.updated_at IS NULL) AS user_irrigations
            INNER JOIN management."Irrigation_Crops" irrigation
            ON irrigation.id = user_irrigations.irrigation_crops_id
            INNER JOIN management."Crop" crop
                        ON
                            irrigation.crop_id = crop."Id"
            INNER JOIN management."User_Equipments" user_eqps
                        ON
                            user_eqps.user_id = user_irrigations.user_id
            `,
      [user_id]
    );

    const data = dbResponse.rows;

    if (!data.length) {
      return null;
    }

    return data.map(mapIrrigationCropsToDomain);
  }

  async getUserIrrigationByName(
    name: string,
    user_id: number
  ): Promise<{ id: number; name: string; user_id: number } | null> {
    const subquery = governmentDb("management.User_Irrigation_Crops")
      .select("*")
      .where("user_id", user_id);

    const dbResponse = await governmentDb(subquery.as("UserIrrigation"))
      .innerJoin(
        "management.Irrigation_Crops as ic",
        "ic.id",
        "UserIrrigation.irrigation_crops_id"
      )
      .innerJoin(
        "management.Crop as c",
        "c.Id",
        "ic.crop_id"
      )
      .where("ic.name", name)
      .andWhere('UserIrrigation.updated_at', null)
      .select("ic.id", "ic.name", "c.Deleted_At")
      .first();

    if (dbResponse) {
      const { id, name } = dbResponse;

      return {
        id,
        name,
        user_id,
      };
    }

    return null;
  }

  async updateUserIrrigationById(id: number, user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .update({
        updated_at: governmentDb.fn.now(),
      })
      .from("User_Irrigation_Crops")
      .where({
        irrigation_crops_id: id,
      })
      .andWhere({
        user_id,
      });
  }

  async getUserIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<{
    id: number;
    user_id: number;
    irrigation_crops_id: number;
    created_at: string;
    updated_at: string;
  } | null> {
    const dbResponse = await governmentDb
      .withSchema("management")
      .select(
        "id",
        "user_id",
        "irrigation_crops_id",
        "created_at",
        "updated_at"
      )
      .from("User_Irrigation_Crops")
      .where({
        user_id,
      })
      .andWhere({
        irrigation_crops_id: id,
      })
      .first();

    if (dbResponse) {
      const { id, user_id, irrigation_crops_id, created_at, updated_at } =
        dbResponse;

      return {
        id,
        user_id,
        irrigation_crops_id,
        created_at,
        updated_at,
      };
    }

    return null;
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
                user_irrigations.user_id,
                irrigation."name" ,
                irrigation.planting_date ,
                irrigation.crop_id ,
                irrigation.system_type ,
                irrigation.area ,
                irrigation.effective_area ,
                irrigation.quantity ,
                irrigation.sprinkler_precipitation ,
                irrigation.length ,
                irrigation.spacing ,
                irrigation.flow ,
                irrigation.time ,
                crop."Id" AS "crop_id",
                crop."Name" AS "crop_name",
                crop."Deleted_At" as "crop_deleted_at",
                user_eqps.station_id,
                (
                    SELECT
                        rs."Et0"
                    FROM
                        government.equipments."ReadStations" rs
                    WHERE
                        rs."FK_Equipment" = user_eqps.station_id
                        AND rs."Time" = (
                            DATE_TRUNC(
                                'day',
                                NOW()::date
                            ) - INTERVAL '3 hours'
                        )::date
                ) AS "ETo",
                user_eqps.pluviometer_id,
                (
                    SELECT
                        COALESCE(
                            rp."Value",
                            0
                        )
                    FROM
                        government.equipments."ReadPluviometers" rp
                    WHERE
                        rp."FK_Equipment" = user_eqps.pluviometer_id
                        AND rp."Time" = (
                            DATE_TRUNC(
                                'day',
                                NOW()::date
                            ) - INTERVAL '3 hours'
                        )::date
                ) AS "pluviometry",
                user_irrigations.created_at,
                user_irrigations.updated_at
            FROM (SELECT * FROM management."User_Irrigation_Crops" uic
            WHERE uic.user_id  = ? AND uic.updated_at IS NULL AND uic.irrigation_crops_id = ?) AS user_irrigations
            INNER JOIN management."Irrigation_Crops" irrigation
            ON irrigation.id = user_irrigations.irrigation_crops_id
            INNER JOIN management."Crop" crop
                        ON
                            irrigation.crop_id = crop."Id"
            INNER JOIN management."User_Equipments" user_eqps
                        ON
                            user_eqps.user_id = user_irrigations.user_id
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
    const dbResponse = await governmentDb.raw(`
        SELECT u."Id",u."Name" ,u."Email"  FROM (SELECT un.user_id FROM management."User_Notifications" un
        WHERE un.service_id = (SELECT ns.id  FROM management."Notification_Services" ns
        WHERE ns.service_id = 'irrigation') AND enabled = true) AS u_with_irrig_notif
        INNER JOIN users."User" u ON u."Id"= u_with_irrig_notif.user_id
        WHERE u."Type" = 'irrigant' AND u."Status" = 'registered'`);

    const data = dbResponse.rows;

    if (!data.length) {
      return null;
    }

    return data.map((row: any) => {
      return {
        Id: row.Id,
        Name: row.Name,
        Email: row.Email,
      };
    });
  }
}
