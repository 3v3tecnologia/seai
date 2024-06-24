import { governmentDb } from "../../../infra/database/postgres/connection/knexfile";

export class UserIrrigantSettingsRepository {
  static async associateEquipmentsToUser(params: {
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

  static async removeEquipments(user_id: number): Promise<void> {
    await governmentDb
      .withSchema("management")
      .del()
      .where({
        user_id,
      })
      .from("User_Equipments");
  }

  static async updateEquipments(params: {
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

  static async getUsersEquipments(user_id: number): Promise<Array<any>> {
    // Join with MeteorologicalEquipments
    return await governmentDb
      .withSchema("management")
      .select("*")
      .from("User_Equipments")
      .where({
        user_id,
      });
  }
}
