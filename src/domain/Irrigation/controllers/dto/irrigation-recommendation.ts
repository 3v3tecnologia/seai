import { IrrigationSystemTypes } from "../../core/model/irrigation-system";
import { IrrigationSystem } from './../../core/model/irrigation-system';

type UserId = { accountId: number };
type Id = { id: number };

export type DeleteIrrigationCropsRequest = UserId & Id;

export type GetIrrigationCropsByIdRequest = UserId & Id;

export type CalcIrrigationRecommendationByIdRequest = UserId & Id;

export type GetAllIrrigationCropsRequest = UserId;

export type SaveIrrigationCropsRequest = {
  CropId: number;
  Name: string;
  PlantingDate: string;
  IrrigationEfficiency: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystem;
  };
} & UserId;
export type UpdateIrrigationCropsRequest = {
  CropId: number;
  Name: string;
  PlantingDate: string;
  IrrigationEfficiency: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystem;
  };
} & UserId &
  Id;
export type calcIrrigationRecommendationRequest =
  any;
