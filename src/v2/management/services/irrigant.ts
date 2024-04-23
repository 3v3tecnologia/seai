import { left, right } from "../../../shared/Either";
import {
  dateDiffInDays,
  getYesterDayDate,
  parseBrazilianDateTime,
} from "../../../shared/utils/date";
import { BladeSuggestion } from "../entities/blade-suggestion";
import { ManagementCropCycle } from "../entities/crop-cycles";
import {
  IrrigationSystemEntity,
  irrigationsTypesNames,
} from "../entities/irrigation-system";
import {
  Dripping,
  DrippingProps,
  IIrrigationSystemMeasurementsEntity,
  MicroSprinkling,
  MicroSprinklingProps,
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
import { ICalcBaldeIrrigationRecommendationService } from "../ports/irrigant/dto";

export class IrrigationRecommendationServices {
  static async calcBladeIrrigationRecommendation(
    command: ICalcBaldeIrrigationRecommendationService.Input
  ): ICalcBaldeIrrigationRecommendationService.Output {
    const yesterDay = getYesterDayDate("-");

    console.log("Buscando ETO pela a data de ontem ", yesterDay);

    let Et0: number | null = null;

    if (Reflect.has(command.Station, "Et0")) {
      Et0 = command.Station.Et0 as number;
    } else {
      const lastStationMeasurements =
        await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromStation(
          command.Station.Id as number,
          yesterDay
        );

      if (lastStationMeasurements?.Et0) Et0 = lastStationMeasurements.Et0;
    }

    if (Et0 == null) {
      return left(new ManagementIrrigantErrors.StationMeasurementsNotFound());
    }

    console.log("[ET0] :: ", Et0);

    let Precipitation: number | null = null;

    if (Reflect.has(command, "Pluviometer") == false) {
      return left(new Error("É necessário informar o atributo 'Pluviometer'"));
    }

    if (
      [
        Reflect.has(command, "Id") == false,
        Reflect.has(command, "Precipitation") == false,
      ].every((pred) => pred == false)
    ) {
      return left(
        new Error(
          "É necessário informar no atributo 'Pluviometer' o campo 'Precipitation' ou 'Id'"
        )
      );
    }
    if (Reflect.has(command.Pluviometer, "Precipitation")) {
      Precipitation = command.Pluviometer.Precipitation as number;
    } else {
      const lastPluviometerMeasurements =
        await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
          command.Pluviometer.Id as number
        );

      if (lastPluviometerMeasurements?.Precipitation)
        Precipitation = lastPluviometerMeasurements.Precipitation;
    }

    if (Precipitation == null) {
      return left(
        new ManagementIrrigantErrors.PluviometerMeasurementsNotFound()
      );
    }

    let systemOrError;

    switch (command.System.Type) {
      case irrigationsTypesNames.MicroSprinkling:
        systemOrError = MicroSprinkling.create(
          command.System.Measurements as MicroSprinklingProps
        );
        break;
      case irrigationsTypesNames.Dripping:
        systemOrError = Dripping.create(
          command.System.Measurements as DrippingProps
        );
        break;
      case irrigationsTypesNames.Sprinkling:
        systemOrError = Sprinkling.create(
          command.System.Measurements as SprinklingProps
        );
        break;
      case irrigationsTypesNames.Pivot:
        systemOrError = Pivot.create(command.System.Measurements as PivotProps);
        break;
      default:
        systemOrError = Sulcos.create(
          command.System.Measurements as SulcosProps
        );
    }

    if (systemOrError.isLeft()) {
      return left(systemOrError.value);
    }

    const irrigationSystem = new IrrigationSystemEntity({
      type: command.System.Type,
      measurements: systemOrError.value as IIrrigationSystemMeasurementsEntity,
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
      Kc: bladeSuggestion.Kc,
    });
  }
}

// [DÚVIDA] plantingDate tem que ser no passado?
function getCropDate(plantingDate: string) {
  const currentDate = new Date();
  const diff = dateDiffInDays(
    currentDate,
    new Date(parseBrazilianDateTime(plantingDate))
  );
  return diff < 0 ? 0 : diff;
}

// Entity?
function findKc(cropDate: number, cropCycles: Array<ManagementCropCycle>) {
  return cropCycles.find(
    (cycle) => cropDate >= cycle.Start && cropDate <= cycle.End
  );
}
