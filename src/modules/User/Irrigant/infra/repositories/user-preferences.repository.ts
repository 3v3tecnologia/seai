import { governmentDb } from "../../../../../infra/database/postgres/connection/knexfile";
import { IUserPreferencesRepository } from "./protocol/preferences.repository";

export class IrrigantPreferencesRepository
  implements IUserPreferencesRepository
{
  async associateEquipmentsToUser(params: {
    user_id: number;
    station_id: number;
    pluviometer_id: number;
  }): Promise<void> {
    const { pluviometer_id, station_id, user_id } = params;

    await governmentDb
      .withSchema("management")
      .insert({
        user_id,
        station_id,
        pluviometer_id,
      })
      .into("User_Equipments");
  }

  async removeEquipments(user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        user_id,
      })
      .from("User_Equipments");
  }

  async updateEquipments(params: {
    user_id: number;
    station_id: number;
    pluviometer_id: number;
  }): Promise<void> {
    const { pluviometer_id, station_id, user_id } = params;

    await governmentDb
      .withSchema("management")
      .update({
        station_id,
        pluviometer_id,
        updated_at: governmentDb.fn.now(),
      })
      .where({
        user_id,
      })
      .from("User_Equipments");
  }

  async getUsersEquipments(user_id: number): Promise<Array<any>> {
    // Join with MeteorologicalEquipments
    return await governmentDb
      .withSchema("management")
      .select("*")
      .from("User_Equipments")
      .where({
        user_id,
      });
  }

  async getAvailableNotificationsServices(): Promise<Array<{
    id: number;
    service: string;
  }> | null> {
    const response = await governmentDb
      .withSchema("management")
      .select("*")
      .from("Notification_Services");

    if (response) {
      return response.map((row: any) => ({
        id: row.id,
        service: row.service_id,
      }));
    }

    return null;
  }

  async getAvailableNotificationsServicesById(
    id: number
  ): Promise<{ id: number; service: string } | null> {
    const response = await governmentDb
      .withSchema("management")
      .select("*")
      .where({
        id,
      })
      .from("Notification_Services")
      .first();

    if (response) {
      return {
        id: response.id,
        service: response.service_id,
      };
    }

    return null;
  }

  async getUserNotificationsPreferences(
    user_id: number
  ): Promise<Array<any> | null> {
    const dbResponse = await governmentDb.raw(
      `
      SELECT
          un.service_id ,
                ns.service_id AS "service" ,
                un.enabled
      FROM
          (
              SELECT
                  *
              FROM
                  management."User_Notifications" un
              WHERE
                  un.user_id = ?
          ) AS un
      INNER JOIN management."Notification_Services" ns
      ON
          ns.id = un.service_id
      ORDER BY
                un.service_id ASC
      `,
      [user_id]
    );

    const rows = dbResponse.rows;

    if (!rows.length) {
      return null;
    }

    return rows.map((row: any) => ({
      ServiceId: row.service_id,
      Service: row.service,
      Enabled: row.enabled,
    }));
  }

  // When create a user
  async createUserNotificationsPreferences(
    input: Array<{
      user_id: number;
      service_id: number;
      enabled: boolean;
    }>
  ): Promise<void> {
    await governmentDb.batchInsert<any>("management.User_Notifications", input);
  }

  async removeUserNotificationsPreferences(user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        user_id,
      })
      .from("User_Notifications");
  }

  async updateUserNotificationPreference(input: {
    user_id: number;
    service_id: number;
    enabled: boolean;
  }): Promise<void> {
    await governmentDb
      .withSchema("management")
      .update({
        enabled: input.enabled,
      })
      .where({ user_id: input.user_id })
      .andWhere({ service_id: input.service_id })
      .from("User_Notifications");
  }
}
