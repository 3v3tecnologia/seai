import { formatDateStringToTime } from "../../../../shared/utils/date";
import {
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
  irrigationsTypesNames,
} from "../../core/model/irrigation-system";
import { IUserRecordedRecommendationData } from "../../repositories/protocols/irrigation.repository";

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
  CropId: number;
  Crop: string;
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
          Length: recordedRecommendation.Length as number,
          Spacing: recordedRecommendation.Spacing as number,
          Flow: recordedRecommendation.Flow as number,
        };
        break;
      default:
        throw new Error("Tipo de sistema não reconhecido.");
    }

    const data = {
      Name: recordedRecommendation.Name,
      CropId: recordedRecommendation.CropId as number,
      Crop: recordedRecommendation.Crop as string,
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

    if (recordedRecommendation.Id) {
      Object.assign(data, {
        Id: recordedRecommendation.Id,
      });
    }

    this.params = data;
  }

  get Id() {
    return this.params.Id;
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

  get Crop() {
    return this.params.Crop;
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
