import { Either } from "../../../../../shared/Either";
import {
  GetUserNotificationsPreferencesOutputDTO,
  SaveUserEquipmentsDTO,
  UpdateUserEquipmentsDTO,
  UpdateUserPreferencesDTO,
} from "../dto/user-settings";

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
