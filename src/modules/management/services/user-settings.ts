import { Either, right } from "../../../shared/Either";

import { UserIrrigantSettingsRepository } from "../repositories/user.repository";
import {
  SaveUserEquipmentsDTO,
  UpdateUserEquipmentsDTO,
} from "./dto/user-settings";

export class UserSettingsServices {
  //Associate equipments to User
  // The user is allowed to have only 2 equipments
  static async saveEquipments(
    dto: SaveUserEquipmentsDTO
  ): Promise<Either<Error, string>> {
    // Shouldn't allow the user to save duplicate equipments
    await UserIrrigantSettingsRepository.removeEquipments(dto.UserId);

    // Save user equipments
    // Should get all activated equipments
    await UserIrrigantSettingsRepository.associateEquipmentsToUser({
      user_id: dto.UserId,
      pluviometer_id: dto.PluviometerId,
      station_id: dto.StationId,
    });

    return right("Sucesso ao salvar equipamentos");
  }
  static async deleteEquipments(user_id: number): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await UserIrrigantSettingsRepository.removeEquipments(user_id);

    return right();
  }
  static async updateEquipments(
    dto: UpdateUserEquipmentsDTO
  ): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await UserIrrigantSettingsRepository.updateEquipments({
      user_id: dto.UserId,
      station_id: dto.StationId,
      pluviometer_id: dto.PluviometerId,
    });

    return right();
  }
  // Get user's equipments
  static async getEquipments(
    user_id: number
  ): Promise<Either<Error, Array<any>>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    return right(
      await UserIrrigantSettingsRepository.getUsersEquipments(user_id)
    );
  }
}
