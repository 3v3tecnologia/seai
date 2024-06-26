import { Either } from "../../../../shared/Either";
import {
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
} from "../../entities/irrigation-system";

export namespace ICalcBaldeIrrigationRecommendationService {
  export type Input = {
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
    IrrigationEfficiency: number;
    System: {
      Type: IrrigationSystemTypes;
      Measurements: IrrigationSystemMeasurementsTypes;
    };
  };

  export type Output = Promise<Either<Error, any | null>>;
}
