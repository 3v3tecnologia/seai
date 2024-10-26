import { Either, left, right } from "../../../../shared/Either";
import { decimalToHoursAndMinutes } from "../../../../shared/utils/date";
import { DecimalFormatter } from "../../../../shared/utils/decimal-formatter";
import { getCropDate, ManagementCrop } from "../../../Crop/core/model/crop";
import { ManagementCropCycle } from "../../../Crop/core/model/crop-cycles";
import { IrrigationSystem } from "./irrigation-system";
import { Pivot } from "./irrigation-system";

export type CalcIrrigationInput = {
  Et0: number;
  precipitation: number;
  crop: ManagementCrop;
  plantingDate: string;
  irrigationSystem: IrrigationSystem;
};

function calcEtc(Eto: number, kc: number) {
  return DecimalFormatter.truncate(Eto * kc, 2)
}

function calcIrrigationTime(repositionBlade: number, applicationRate: number) {
  return decimalToHoursAndMinutes(repositionBlade / applicationRate)
}

function calcKc(cropDay: number, cropCycle: ManagementCropCycle) {
  return (cropDay - cropCycle.Start) * cropCycle.Increment + cropCycle.KC
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
    irrigationSystem.Efficiency
  );

  Object.assign(result, {
    Etc,
    Et0: DecimalFormatter.truncate(Et0, 2),
    Precipitation: precipitation,
    Kc,
    RepositionBlade: repositionBlade,
    Stage: cropCycle?.Title,
    CropDays: cropDate,
    IrrigationEfficiency: irrigationSystem.Efficiency,
    PlantingDate: plantingDate
  })


  if (irrigationSystem instanceof Pivot) {
    // O pivô só dá uma volta por dia, então, é interessante verificar se o tempo é superior
    //a 24 horas, e alertar o usuário(caso de uma velocidade de operação muito baixa)
    if (irrigationSystem.Time > 24) {
      return left(new Error("O pivô só dá uma volta por dia,é necessário verificar se o tempo é superior a 24 horas"));
    }

    irrigationSystem.setVelocity(repositionBlade)

    const operationTime = irrigationSystem.calOperatingTime()

    //Se a lâmina necessária for menor do que a lâmina aplicada em uma volta do pivô,
    //sugerir 100 % de velocidade
    const vel = repositionBlade < irrigationSystem.Area ? 1 : irrigationSystem.Velocity

    Object.assign(result, {
      Velocity: vel,
      IrrigationTime: operationTime,
    })

    return right(result as IrrigationRecommendationData)
  }

  const irrigationTime = calcIrrigationTime(
    repositionBlade,
    irrigationSystem.ApplicationRate
  )

  Object.assign(result, {
    IrrigationTime: irrigationTime,
  })

  return right(result as IrrigationRecommendationData)

}

