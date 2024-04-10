import { Either, left, right } from "../../../shared/Either";
import { ManagementIrrigantErrors } from "../errors/irrigant.error";
import { ManagementCropErrors } from "../errors/management-crop-errors";
import { DbEquipmentsMeasurementsRepository } from "../infra/database/repositories/equipments-measurements.repository";

import { DbManagementCropRepository } from "../infra/database/repositories/management-crop.repository";

namespace ICalcBaldeIrrigationRecommendationService {
  export type Input = {
    station_id: number;
    pluviometer_id: number;
    crop_id: number;
    planting_date: string;
    irrigation_efficiency: number;
    application_rate: number;
  };

  export type Output = Promise<Either<Error, any | null>>;
}

export class IrrigationRecommendationUseCases {
  static async calcBladeIrrigationRecommendation(
    command: ICalcBaldeIrrigationRecommendationService.Input
  ): ICalcBaldeIrrigationRecommendationService.Output {
    const lastStationMeasurements =
      await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromStation(
        command.station_id
      );

    if (lastStationMeasurements == null) {
      return left(new ManagementIrrigantErrors.StationMeasurementsNotFound());
    }

    const lastPluviometerMeasurements =
      await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
        command.pluviometer_id
      );

    if (lastPluviometerMeasurements == null) {
      return left(
        new ManagementIrrigantErrors.PluviometerMeasurementsNotFound()
      );
    }

    // [Dúvida] Como descobrir o dia da cultura?

    //  Valores do coeficiente de cultura (Kc) para cada fase de crescimento da cultura
    const cropCycles = await DbManagementCropRepository.findCropsCycles(
      command.crop_id
    );

    if (cropCycles == null) {
      return left(new ManagementCropErrors.CropCyclesError());
    }

    const currentDate = new Date();

    const plantingDate = new Date(
      parseBrazilianDateTime(command.planting_date)
    );

    const cropDate = dateDiffInDays(currentDate, plantingDate);

    //  Evapotranspiração de referencia :  o quanto de água que uma cultura perderia sem nenhuma deficiência hídrica
    const ETo = lastStationMeasurements.Et0;

    // Coeficiente da cultura : serve para estimar a evapotranspiração específica da cultura (ETC)
    // varia de acordo com o ciclo de crescimento da cultura
    const Kc = 50;

    // Evapotranspiração específica da cultura levando em consideração suas características
    const ETc = ETo * Kc;

    const repositionBlade = ETc / command.irrigation_efficiency;

    // [Dúvida] Vai precisar converter dados da asperção para tempo?

    // Taxa de aplicação
    const applicationRate = 1;

    return right({
      Etc: 22,
      RepositionBlade: repositionBlade,
      IrrigationTime: 21,
      CropDay: "23/02/2024",
      ETo,
      Precipitation: 1,
    });
  }
}

function dateDiffInDays(start: Date, end: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function parseBrazilianDateTime(dateTimeString: string) {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);

  // Create a Date object with the parsed components
  const brazilianDate = new Date(Date.UTC(year, month - 1, day));

  return brazilianDate;
}
