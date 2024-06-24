import { Either, right } from "../../../../shared/Either";
import { IUserPreferencesRepository } from "../repositories/protocol/preferences.repository";

import {
  GetUserNotificationsPreferencesOutputDTO,
  SaveUserEquipmentsDTO,
  UpdateUserEquipmentsDTO,
  UpdateUserPreferencesDTO,
} from "./dto/user-settings";

export interface IUserPreferencesServices {
  saveEquipments(dto: SaveUserEquipmentsDTO): Promise<Either<Error, string>>;
  deleteEquipments(user_id: number): Promise<Either<Error, void>>;
  updateEquipments(dto: UpdateUserEquipmentsDTO): Promise<Either<Error, void>>;
  getEquipments(user_id: number): Promise<Either<Error, Array<any>>>;
  updateNotifications(
    dto: UpdateUserEquipmentsDTO
  ): Promise<Either<Error, void>>;
  getNotifications(user_id: number): Promise<Either<Error, Array<any>>>;
  updateUserNotificationPreference(
    dto: UpdateUserPreferencesDTO
  ): Promise<Either<Error, void>>;
  getUserNotificationsPreferences(
    user_id: number
  ): Promise<GetUserNotificationsPreferencesOutputDTO>;
}

export class UserSettingsServices implements IUserPreferencesServices {
  constructor(private repository: IUserPreferencesRepository) {}
  //Associate equipments to User
  // The user is allowed to have only 2 equipments
  async saveEquipments(
    dto: SaveUserEquipmentsDTO
  ): Promise<Either<Error, string>> {
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.removeEquipments(dto.UserId);

    // Save user equipments
    // Should get all activated equipments
    await this.repository.associateEquipmentsToUser({
      user_id: dto.UserId,
      pluviometer_id: dto.PluviometerId,
      station_id: dto.StationId,
    });

    return right("Sucesso ao salvar equipamentos");
  }
  async deleteEquipments(user_id: number): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.removeEquipments(user_id);

    return right();
  }
  async updateEquipments(
    dto: UpdateUserEquipmentsDTO
  ): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.updateEquipments({
      user_id: dto.UserId,
      station_id: dto.StationId,
      pluviometer_id: dto.PluviometerId,
    });

    return right();
  }
  // Get user's equipments
  async getEquipments(user_id: number): Promise<Either<Error, Array<any>>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    return right(await this.repository.getUsersEquipments(user_id));
  }

  async updateNotifications(
    dto: UpdateUserEquipmentsDTO
  ): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await this.repository.updateEquipments({
      user_id: dto.UserId,
      station_id: dto.StationId,
      pluviometer_id: dto.PluviometerId,
    });

    return right();
  }
  // Get user's equipments
  async getNotifications(user_id: number): Promise<Either<Error, Array<any>>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    return right(await this.repository.getUsersEquipments(user_id));
  }

  async updateUserNotificationPreference(
    dto: UpdateUserPreferencesDTO
  ): Promise<Either<Error, void>> {
    await this.repository.updateUserNotificationPreference({
      service_id: dto.ServiceId,
      user_id: dto.UserId,
      enabled: dto.Enabled,
    });
    return right();
  }

  async getUserNotificationsPreferences(
    user_id: number
  ): Promise<GetUserNotificationsPreferencesOutputDTO> {
    return right(
      await this.repository.getUserNotificationsPreferences(user_id)
    );
  }
}
