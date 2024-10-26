import { IrrigationSystemTypes } from "../../../core/model/irrigation-system";
import { UserIrrigationPreferences } from "../../../services/dto/irrigation-recommendation";


export type DbUserIrrigationPreferences = {
  id?: number;
  name: string;
  user_id: number;
  crop_id: number;
  planting_date: string;
  system_type: IrrigationSystemTypes;
  area?: number;
  // effective_area?: number;
  quantity?: number;
  sprinkler_precipitation?: number;
  length?: number;
  spacing?: number;
  flow?: number;
  time?: number; //Tempo “T” em horas e minutos para uma volta com 100% de velocidade (Pivô)
};

// export type IUserRecordedRecommendationData = {
//   Id: number;
//   StationId: number;
//   Name: string;
//   PluviometerId: number;
//   SystemType: IrrigationSystemTypes;
//   CropId: number | null;
//   Crop: string | null;
//   PlantingDate: string;
//   ETo: number | null;
//   Pluviometry: number | null;
//   Area?: number | null;
//   // EffectiveArea?: number | null;
//   Quantity?: number | null;
//   System_Precipitation?: number | null;
//   Length?: number | null;
//   Spacing?: number | null;
//   Time?: number | null;
//   Flow?: number | null;
//   CreatedAt: string;
//   UpdatedAt?: string | null;
// };


export interface IUserIrrigationPreferencesRepository {
  save(params: DbUserIrrigationPreferences): Promise<number | null>;
  deleteByUserId(user_id: number): Promise<void>;
  deleteById(id: number, user_id: number): Promise<void>;
  update(params: Required<DbUserIrrigationPreferences>): Promise<void>;
  getUserIrrigationByName(
    name: string,
    user_id: number
  ): Promise<{ id: number; name: string; user_id: number } | null>;
  getByUserId(
    user_id: number
  ): Promise<Array<UserIrrigationPreferences> | null>;
  getById(
    id: number,
    user_id: number
  ): Promise<UserIrrigationPreferences | null>;
  getUserIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<{
    id: number;
    user_id: number;
    irrigation_crops_id: number;
    created_at: string;
    updated_at: string;
  } | null>;
  updateUserIrrigationById(id: number, user_id: number): Promise<void>;
  getUsersWithIrrigationReportsEnabled(): Promise<Array<{
    Id: number;
    Name: string;
    Email: string;
  }> | null>;
}
