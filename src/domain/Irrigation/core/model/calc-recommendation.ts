import { Either, left, right } from "../../../../shared/Either";
import { decimalToHoursAndMinutes } from "../../../../shared/utils/date";
import { DecimalFormatter } from "../../../../shared/utils/decimal-formatter";
import { getCropDate, ManagementCrop } from "../../../Crop/core/model/crop";
import { ManagementCropCycle } from "../../../Crop/core/model/crop-cycles";
import { IrrigationSystemEntity } from "./irrigation-system";
import { Pivot } from "./irrigation-system-measurements";

export type CalcIrrigationInput = {
  Et0: number;
  precipitation: number;
  crop: ManagementCrop;
  plantingDate: string;
  irrigationSystem: IrrigationSystemEntity;
};

function calcEtc(Eto: number, kc: number) {
  return DecimalFormatter.truncate(Eto * kc, 2)
}

function calcIrrigationTime(repositionBlade: number, applicationRate: number) {
  return decimalToHoursAndMinutes(repositionBlade / applicationRate)
}

function calcKc(cropDay: number, cropCycle: ManagementCropCycle) {
  return DecimalFormatter.truncate(
    (cropDay - cropCycle.Start) * cropCycle.Increment + cropCycle.KC,
    2
  )
}

function calcRepositionBlade(
  Etc: number,
  precipitation: number,
  efficiency: number
) {
  const EtcMinusPrecipitation = Etc - precipitation

  if (EtcMinusPrecipitation < 0) {
    return 0
  }

  return DecimalFormatter.truncate(
    EtcMinusPrecipitation / efficiency,
    2
  )
}

type DefaultIrrigationRecommendation = {
  Etc: number;
  Kc: number;
  RepositionBlade: number;
  Stage: string;
  CropDays: number;
  IrrigationTime: string;
  IrrigationEfficiency: number;
  Precipitation: number;
  Et0: number;
}

type PivotIrrigationRecommendation = {
  Velocity: number;
} & DefaultIrrigationRecommendation


export type IrrigationRecommendationData = PivotIrrigationRecommendation | DefaultIrrigationRecommendation


export function calcIrrigationRecommendation({ Et0, crop, irrigationSystem, plantingDate, precipitation }: CalcIrrigationInput): Either<Error, IrrigationRecommendationData> {
  const cropDate = getCropDate(plantingDate);


  const cycleOrError = crop.findKc(cropDate)

  if (cycleOrError.isLeft()) {
    return left(cycleOrError.value);
  }

  /**
     * INFO: Valores do coeficiente de cultura (Kc) variando para cada fase de crescimento da cultura
    */
  const cropCycle = cycleOrError.value;

  const result = {}

  const Kc = calcKc(cropDate, cropCycle as ManagementCropCycle);

  const Etc = calcEtc(Et0, Kc);

  const repositionBlade = calcRepositionBlade(
    Etc,
    precipitation,
    irrigationSystem.efficiency
  );

  Object.assign(result, {
    Etc,
    Et0: DecimalFormatter.truncate(Et0, 2),
    Precipitation: precipitation,
    Kc,
    RepositionBlade: repositionBlade,
    Stage: cropCycle?.Title,
    CropDays: cropDate,
    IrrigationEfficiency: irrigationSystem.efficiency,
    PlantingDate: plantingDate
  })

  if (irrigationSystem.type === 'Pivô Central') {
    const pivot = irrigationSystem.measurements as Pivot

    pivot.setVelocity(repositionBlade)

    const operationTime = pivot.calOperatingTime()

    Object.assign(result, {
      Velocity: pivot.Velocity,
      IrrigationTime: operationTime,
    })

    return right(result as IrrigationRecommendationData)
  }
  /**
   *  Pivô Central: Obtenção do número de voltas necessárias para a reposição
   *  Em outros tipos de sistemas a saída será em horas
   */
  const irrigationTime = calcIrrigationTime(
    repositionBlade,
    irrigationSystem.applicationRate
  )

  Object.assign(result, {
    IrrigationTime: irrigationTime,
  })

  return right(result as IrrigationRecommendationData)

}

