type UserId = { accountId: number };
type Id = { id: number };

export type SaveEquipmentsRequest = {
  StationId: number;
  PluviometerId: number;
} & UserId;

export type UpdateEquipmentsRequest = SaveEquipmentsRequest;

export type DeleteEquipmentRequest = Id;
export type GetEquipmentsRequest = UserId;

export type UpdateUserPreferencesRequest = {
  ServiceId: number;
  Enabled: boolean;
} & UserId;

export type GetUserNotificationsPreferences = UserId;
