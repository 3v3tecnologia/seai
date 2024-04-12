import { Either, left, right } from "../../../shared/Either";
import { BladeSuggestion } from "../entities/blade-suggestion";
import { ManagementCropCycle } from "../entities/crop-cycles";
import {
  IrrigationSystemEntity,
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
  irrigationsTypesNames,
} from "../entities/irrigation-system";
import {
  IrrigationSystemMeasurementsEntity,
  MicroSprinklingOrDripping,
  MicroSprinklingOrDrippingProps,
  Pivot,
  PivotProps,
  Sprinkling,
  SprinklingProps,
  Sulcos,
  SulcosProps,
} from "../entities/irrigation-system-measurements";
import { ManagementIrrigantErrors } from "../errors/irrigant.error";
import { ManagementCropErrors } from "../errors/management-crop-errors";
import { DbEquipmentsMeasurementsRepository } from "../infra/database/repositories/equipments-measurements.repository";

import { DbManagementCropRepository } from "../infra/database/repositories/management-crop.repository";

export namespace ICalcBaldeIrrigationRecommendationService {
  export type Input = {
    StationId: number;
    PluviometerId: number;
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

export class IrrigationRecommendationServices {
  static async calcBladeIrrigationRecommendation(
    command: ICalcBaldeIrrigationRecommendationService.Input
  ): ICalcBaldeIrrigationRecommendationService.Output {
    //  [Dúvida] O que é feito com a leitura do pluviômetro?
    const [lastStationMeasurements, lastPluviometerMeasurements] =
      await Promise.all([
        DbEquipmentsMeasurementsRepository.getLastMeasurementsFromStation(
          command.StationId
        ),
        DbEquipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
          command.PluviometerId
        ),
      ]);

    console.log(lastPluviometerMeasurements);
    if (lastStationMeasurements == null) {
      return left(new ManagementIrrigantErrors.StationMeasurementsNotFound());
    }

    if (lastPluviometerMeasurements == null) {
      return left(
        new ManagementIrrigantErrors.PluviometerMeasurementsNotFound()
      );
    }

    const { Et0 } = lastStationMeasurements;
    const { Precipitation } = lastPluviometerMeasurements;

    let system: IrrigationSystemMeasurementsEntity;

    switch (command.System.Type) {
      case irrigationsTypesNames.MicroSprinkling:
      case irrigationsTypesNames.Dripping:
        system = new MicroSprinklingOrDripping(
          command.System.Measurements as MicroSprinklingOrDrippingProps
        );
      case irrigationsTypesNames.Sprinkling:
        system = new Sprinkling(command.System.Measurements as SprinklingProps);
      case irrigationsTypesNames.Pivot:
        system = new Pivot(command.System.Measurements as PivotProps);
      default:
        system = new Sulcos(command.System.Measurements as SulcosProps);
    }

    const irrigationSystem = new IrrigationSystemEntity({
      type: command.System.Type,
      measurements: system,
      efficiency: command.IrrigationEfficiency,
    });

    //  Valores do coeficiente de cultura (Kc) para cada fase de crescimento da cultura
    const cropCycles = await DbManagementCropRepository.findCropsCycles(
      command.CropId
    );

    if (cropCycles == null) {
      return left(new ManagementCropErrors.CropCyclesError());
    }

    const cropDate = getCropDate(command.PlantingDate);

    // Coeficiente da cultura : serve para estimar a evapotranspiração específica da cultura (ETC)
    // varia de acordo com o ciclo de crescimento da cultura
    const cycle = findKc(cropDate, cropCycles);

    if (!cycle) {
      return left(new ManagementIrrigantErrors.CropDateNotFound());
    }

    const bladeSuggestion = BladeSuggestion.create({
      cropCycle: cycle,
      precipitation: Precipitation,
      Et0,
      irrigationSystem: irrigationSystem,
      plantingDate: command.PlantingDate,
    });

    return right({
      Etc: bladeSuggestion.Etc,
      RepositionBlade: bladeSuggestion.repositionBlade,
      IrrigationTime: bladeSuggestion.irrigationTime,
      CropDays: cropDate,
      Et0,
      Precipitation,
    });
  }
}

// [DÚVIDA] plantingDate tem que ser no passado?
// [Dúvida] Como descobrir o dia da cultura?
// [DÚVIDA] E se o dia da cultura foi negativo?

function getCropDate(plantingDate: string) {
  const currentDate = new Date();
  const diff = dateDiffInDays(
    new Date(parseBrazilianDateTime(plantingDate)),
    currentDate
  );
  return diff < 0 ? 0 : diff;
}

// Entity?
function findKc(cropDate: number, cropCycles: Array<ManagementCropCycle>) {
  return cropCycles.find(
    (cycle) => cropDate >= cycle.Start && cropDate <= cycle.End
  );
}
export function dateDiffInDays(start: Date, end: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function parseBrazilianDateTime(dateTimeString: string) {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);

  // Create a Date object with the parsed components
  const brazilianDate = new Date(Date.UTC(year, month - 1, day));

  return brazilianDate;
}
