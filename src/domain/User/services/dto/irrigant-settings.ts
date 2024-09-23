import { Either } from "../../../../shared/Either";

export type SaveUserEquipmentsDTO = {
  UserId: number;
  StationId: number;
  PluviometerId: number;
};

export type UpdateUserEquipmentsDTO = {
  UserId: number;
  StationId: number;
  PluviometerId: number;
};

export type UpdateUserPreferencesDTO = {
  UserId: number;
  ServiceId: number;
  Enabled: boolean;
};

export type GetUserNotificationsPreferencesOutputDTO = Either<
  Error,
  any[] | null
>;
