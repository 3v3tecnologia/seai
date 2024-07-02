import {
  formatDateStringToTime,
  parseBrazilianDateTime,
} from "../../../../shared/utils/date";
import {
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
  irrigationsTypesNames,
} from "../../core/model/irrigation-system";
import { IUserRecordedRecommendationData } from "../../repositories/irrigation.repository";

export type ISaveIrrigationRecommendationDTO = {
  UserId: number;
  Name: string;
  CropId: number;
  PlantingDate: string;
  IrrigationEfficiency: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystemMeasurementsTypes;
  };
};

export type IUpdateIrrigationRecommendationDTO =
  ISaveIrrigationRecommendationDTO & {
    Id: number;
  };

export type ICalcIrrigationRecommendationDTO = {
  Name: string;
  Station: {
    Id?: number;
    Et0?: number;
  };
  Pluviometer: {
    Id?: number;
    Precipitation?: number;
  };
  CropId: number;
  PlantingDate: string;
  IrrigationEfficiency?: number;
  System: {
    Type: IrrigationSystemTypes;
    Measurements: IrrigationSystemMeasurementsTypes;
  };
};

export class CalcIrrigationRecommendationDTO {
  private readonly params: ICalcIrrigationRecommendationDTO;
  constructor(recordedRecommendation: IUserRecordedRecommendationData) {
    let systemMeasurementsProps: IrrigationSystemMeasurementsTypes;

    switch (recordedRecommendation.SystemType) {
      case irrigationsTypesNames.MicroSprinkling:
        systemMeasurementsProps = {
          Area: recordedRecommendation.Area as number,
          EfectiveArea: recordedRecommendation.EffectiveArea as number,
          Flow: recordedRecommendation.Flow as number,
          PlantsQtd: recordedRecommendation.PlantsQtd as number,
        };
        break;
      case irrigationsTypesNames.Dripping:
        systemMeasurementsProps = {
          Area: recordedRecommendation.Area as number,
          EfectiveArea: recordedRecommendation.EffectiveArea as number,
          Flow: recordedRecommendation.Flow as number,
          PlantsQtd: recordedRecommendation.PlantsQtd as number,
        };
        break;
      case irrigationsTypesNames.Sprinkling:
        systemMeasurementsProps = {
          Precipitation: recordedRecommendation.System_Precipitation as number,
        };
        break;
      case irrigationsTypesNames.Pivot:
        systemMeasurementsProps = {
          Precipitation: recordedRecommendation.System_Precipitation as number,
        };
        break;
      case irrigationsTypesNames.Sulcos:
        systemMeasurementsProps = {
          Precipitation: recordedRecommendation.System_Precipitation as number,
        };
        break;
      default:
        throw new Error("Tipo de sistema não reconhecido.");
    }

    this.params = {
      Name: recordedRecommendation.Name,
      CropId: recordedRecommendation.CropId,
      PlantingDate: formatDateStringToTime(recordedRecommendation.PlantingDate),
      Pluviometer: {
        Id: recordedRecommendation.PluviometerId,
      },
      Station: {
        Id: recordedRecommendation.StationId,
      },
      System: {
        Type: recordedRecommendation.SystemType as IrrigationSystemTypes,
        Measurements: systemMeasurementsProps,
      },
    };
  }

  get Station() {
    return this.params.Station;
  }
  get Pluviometer() {
    return this.params.Pluviometer;
  }
  get CropId() {
    return this.params.CropId;
  }
  get PlantingDate() {
    return this.params.PlantingDate;
  }
  get IrrigationEfficiency() {
    return this.params.IrrigationEfficiency;
  }
  get System() {
    return this.params.System;
  }
  get Name() {
    return this.params.Name;
  }
}
