export interface IUserPreferencesRepository {
  associateEquipmentsToUser(params: {
    user_id: number;
    station_id: number;
    pluviometer_id: number;
  }): Promise<void>;
  removeEquipments(user_id: number): Promise<void>;
  updateEquipments(params: {
    user_id: number;
    station_id: number;
    pluviometer_id: number;
  }): Promise<void>;
  getUsersEquipments(user_id: number): Promise<Array<any>>;
  getAvailableNotificationsServices(): Promise<Array<any> | null>;
  getUserNotificationsPreferences(user_id: number): Promise<Array<any> | null>;
  createUserNotificationsPreferences(input: {
    user_id: number;
    service_id: number;
    enabled: boolean;
  }): Promise<void>;
  updateUserNotificationPreference(input: {
    user_id: number;
    service_id: number;
    enabled: boolean;
  }): Promise<void>;
}
