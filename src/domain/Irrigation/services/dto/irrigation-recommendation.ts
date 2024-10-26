import {
  IrrigationSystem,
  IrrigationSystemTypes
} from "../../core/model/irrigation-system";

export type UserIrrigationPreferences = {
  Id?: number;
  Name: string;
  Station: {
    Id?: number;
    Et0?: number;
  };
  Pluviometer: {
    Id?: number;
    Precipitation?: number;
  };
  CropId: number | null;
  Crop: string | null;
  PlantingDate: string;
  IrrigationEfficiency?: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystem;
  };
  CreatedAt?: string,
  UpdatedAt?: string,
};
