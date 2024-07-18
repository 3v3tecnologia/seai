import { IrrigationSystemTypes } from "../../core/model/irrigation-system";

export type IrrigationCropsData = {
  id?: number;
  name: string;
  user_id: number;
  crop_id: number;
  planting_date: string;
  system_type: IrrigationSystemTypes;
  area?: number;
  effective_area?: number;
  plants_qtd?: number;
  sprinkler_precipitation?: number;
  length?: number;
  spacing?: number;
  flow?: number;
};

export type IUserRecordedRecommendationData = {
  Id: number;
  Name: string;
  StationId: number;
  PluviometerId: number;
  SystemType: IrrigationSystemTypes;
  CropId: number;
  Crop: string;
  PlantingDate: string;
  ETo: number | null;
  Pluviometry: number | null;
  Area?: number | null;
  EffectiveArea?: number | null;
  PlantsQtd?: number | null;
  System_Precipitation?: number | null;
  Length?: number | null;
  Spacing?: number | null;
  Flow?: number | null;
  CreatedAt: string;
  UpdatedAt?: string | null;
};

export interface IIrrigationRepository {
  save(params: IrrigationCropsData): Promise<number | null>;
  deleteByUserId(user_id: number): Promise<void>;
  deleteById(id: number, user_id: number): Promise<void>;
  update(params: Required<IrrigationCropsData>): Promise<void>;
  getUserIrrigationByName(
    name: string,
    user_id: number
  ): Promise<{ id: number; name: string; user_id: number } | null>;
  getByUserId(
    user_id: number
  ): Promise<Array<IUserRecordedRecommendationData> | null>;
  getById(
    id: number,
    user_id: number
  ): Promise<IUserRecordedRecommendationData | null>;
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
