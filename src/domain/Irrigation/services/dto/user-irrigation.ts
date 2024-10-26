import { IrrigationSystem, IrrigationSystemTypes } from "../../core/model/irrigation-system";

export type SaveUserIrrigationPreferencesInput = {
  UserId: number;
  Name: string;
  CropId: number;
  PlantingDate: string;
  IrrigationEfficiency: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystem;
  };
};

export type UpdateUserIrrigationPreferencesInput =
  SaveUserIrrigationPreferencesInput & {
    Id: number;
  };
