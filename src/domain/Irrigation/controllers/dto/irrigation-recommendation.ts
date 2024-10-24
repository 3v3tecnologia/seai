import {
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
} from "../../core/model/irrigation-system";
import { ICalcIrrigationRecommendationDTO } from "../../services/dto/irrigation";

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
    Measurements: IrrigationSystemMeasurementsTypes;
  };
} & UserId;
export type UpdateIrrigationCropsRequest = {
  CropId: number;
  Name: string;
  PlantingDate: string;
  IrrigationEfficiency: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystemMeasurementsTypes;
  };
} & UserId &
  Id;
export type calcIrrigationRecommendationRequest =
  ICalcIrrigationRecommendationDTO;
