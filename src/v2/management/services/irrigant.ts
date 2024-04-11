import { Either, left, right } from "../../../shared/Either";
import { ManagementIrrigantErrors } from "../errors/irrigant.error";
import { ManagementCropErrors } from "../errors/management-crop-errors";
import { DbEquipmentsMeasurementsRepository } from "../infra/database/repositories/equipments-measurements.repository";

import { DbManagementCropRepository } from "../infra/database/repositories/management-crop.repository";

export namespace ICalcBaldeIrrigationRecommendationService {
  export type Sprinkling={
    precipitation:number;
  }

  export type MicroSprinklingOrDripping={
    flow:number;
    area:number;
    efectiveArea:number;
    plantsQtd:number;
  }

  export type Pivot={
    precipitation:number
  }

  export type Sulcos={
    length:number
    spacing:number
    flow:number
  }

  export type Input = {
    stationId: number;
    pluviometerId: number;
    cropId: number;
    plantingDate: string;
    irrigationEfficiency: number;
    applicationRate: number;
    system:{
      type:'Aspersão' | 'Micro-Aspersão' | 'Gotejamento' | 'Pivô' | 'Sulcos';
      measurements: Sulcos | Pivot | MicroSprinklingOrDripping | Sprinkling;
    }
  };

  export type Output = Promise<Either<Error, any | null>>;
}

export class IrrigationRecommendationUseCases {
  static async calcBladeIrrigationRecommendation(
    command: ICalcBaldeIrrigationRecommendationService.Input
  ): ICalcBaldeIrrigationRecommendationService.Output {

    const lastStationMeasurements =
      await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromStation(
        command.stationId
      );

    if (lastStationMeasurements == null) {
      return left(new ManagementIrrigantErrors.StationMeasurementsNotFound());
    }

    const lastPluviometerMeasurements =
      await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
        command.pluviometerId
      );

    if (lastPluviometerMeasurements == null) {
      return left(
        new ManagementIrrigantErrors.PluviometerMeasurementsNotFound()
      );
    }

    // [Dúvida] Como descobrir o dia da cultura?

    //  Valores do coeficiente de cultura (Kc) para cada fase de crescimento da cultura
    const cropCycles = await DbManagementCropRepository.findCropsCycles(
      command.cropId
    );

    if (cropCycles == null) {
      return left(new ManagementCropErrors.CropCyclesError());
    }

    const currentDate = new Date();

    const plantingDate = new Date(
      parseBrazilianDateTime(command.plantingDate)
    );

    const cropDate = dateDiffInDays(currentDate, plantingDate);

    //  Evapotranspiração de referencia :  o quanto de água que uma cultura perderia sem nenhuma deficiência hídrica
    const ETo = lastStationMeasurements.Et0;

    // Coeficiente da cultura : serve para estimar a evapotranspiração específica da cultura (ETC)
    // varia de acordo com o ciclo de crescimento da cultura
    const Kc = 50;

    // Evapotranspiração específica da cultura levando em consideração suas características
    const ETc = ETo * Kc;

    const repositionBlade = ETc / command.irrigationEfficiency;

    // [Dúvida] Vai precisar converter dados da asperção para tempo?

    // Taxa de aplicação
    let applicationRate = 0;

    if(['Micro-Aspersão','Gotejamento'].includes(command.system.type)){
      const {area,efectiveArea,flow,plantsQtd} = command.system.measurements as ICalcBaldeIrrigationRecommendationService.MicroSprinklingOrDripping
      applicationRate = flow / (area * efectiveArea * plantsQtd)
    }else if(command.system.type === 'Aspersão'){
      // mm/h
      const {precipitation} = command.system.measurements as ICalcBaldeIrrigationRecommendationService.Sprinkling
      applicationRate = precipitation // How convert to time?
    }else if(command.system.type === 'Pivô'){
      const {precipitation} = command.system.measurements as ICalcBaldeIrrigationRecommendationService.Pivot
      applicationRate = precipitation
    }

    const irrigationTime = repositionBlade / applicationRate

    return right({
      Etc: 22,
      RepositionBlade: repositionBlade,
      IrrigationTime: irrigationTime,
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
