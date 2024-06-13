import { Either, left, right } from "../../../shared/Either";
import {
  dateDiffInDays,
  getYesterDayDate,
  parseBrazilianDateTime,
} from "../../../shared/utils/date";
import { DecimalFormatter } from "../../../shared/utils/decimal-formatter";
import { BladeSuggestion } from "../core/model/blade-suggestion";
import {
  IrrigationSystemEntity,
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
  irrigationsTypesNames,
} from "../core/model/irrigation-system";

import { ManagementCropErrors } from "../core/errors/crop-errors";

import { DbEquipmentsMeasurementsRepository } from "../../equipments/repositories/equipments-measurements.repository";
import { IrrigantErrors } from "../core/errors/irrigant.error";
import { Dripping, DrippingProps, IIrrigationSystemMeasurementsEntity, MicroSprinkling, MicroSprinklingProps, Pivot, PivotProps, Sprinkling, SprinklingProps } from "../core/model/irrigation-system-measurements";
import { DbManagementCropRepository } from "../repositories/crop.repository";
import { ManagementCropCycle } from "../core/model/crop-cycles";

export class IrrigationRecommendationServices {
  static async calcBladeIrrigationRecommendation(
    command: ICalcBaldeIrrigationRecommendationService.Input
  ): ICalcBaldeIrrigationRecommendationService.Output {
    const yesterDay = getYesterDayDate("-");

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
      return left(new IrrigantErrors.StationMeasurementsNotFound());
    }

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
        new IrrigantErrors.PluviometerMeasurementsNotFound()
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
      case irrigationsTypesNames.Sulcos:
        systemOrError = Pivot.create(command.System.Measurements as PivotProps);
        break;
      default:
        return left(
          new Error("Tipo de sistema não reconhecido.")
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
    const cycleOrError = findKc(cropDate, cropCycles);

    if (cycleOrError.isLeft()) {
      return left(cycleOrError.value);
    }

    const cropCycle = cycleOrError.value

    const bladeSuggestion = BladeSuggestion.create({
      cropCycle: cropCycle as ManagementCropCycle,
      precipitation: Precipitation,
      Et0,
      irrigationSystem: irrigationSystem,
      plantingDate: command.PlantingDate,
      cropDay: cropDate,
    });

    return right({
      Etc: DecimalFormatter.truncate(bladeSuggestion.Etc, 2),
      RepositionBlade: DecimalFormatter.truncate(
        bladeSuggestion.repositionBlade,
        2
      ),
      IrrigationEfficiency: irrigationSystem.efficiency,
      IrrigationTime: bladeSuggestion.irrigationTime,
      CropDays: cropDate,
      Et0: DecimalFormatter.truncate(Et0, 2),
      Precipitation,
      Kc: bladeSuggestion.Kc,
    });
  }
}

function getCropDate(plantingDate: string) {
  const currentDate = new Date();
  const diff = dateDiffInDays(
    currentDate,
    new Date(parseBrazilianDateTime(plantingDate))
  );
  return diff < 0 ? 0 : diff;
}

// Entity?
function findKc(cropDate: number, cropCycles: Array<ManagementCropCycle>): Either<Error, ManagementCropCycle> {
  const startCropCycle = cropCycles[0]

  if (cropDate < startCropCycle.Start) {
    return left(new Error(`Necessário ajustar a data plantio pois o valor encontra-se ${startCropCycle.Start - cropDate} dia(s) anterior a data de início do ciclo da cultura. `))
  }

  const endCropCycle = cropCycles[cropCycles.length - 1]

  if (cropDate > endCropCycle.End) {
    return left(new Error(`Necessário ajustar a data plantio pois o valor encontra-se após a data do último dia do ciclo da cultura`))
  }

  const data = cropCycles.find(
    (cycle) => cropDate >= cycle.Start && cropDate <= cycle.End
  )

  if (data) {
    return right(data)
  }

  return left(new Error("Não foi possível encontrar valores de KC"))
}

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
