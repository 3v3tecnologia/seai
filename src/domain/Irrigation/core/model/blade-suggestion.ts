import { decimalToHoursAndMinutes } from "../../../../shared/utils/date";
import { ManagementCropCycle } from "../../../Crop/core/model/crop-cycles";
import { IrrigationSystemEntity } from "./irrigation-system";
import { Pivot } from "./irrigation-system-measurements";

export type BladeSuggestionProps = {
  Et0: number;
  precipitation: number;
  cropCycle: ManagementCropCycle;
  plantingDate: string;
  irrigationSystem: IrrigationSystemEntity;
  cropDay: number;
};

export class BladeSuggestion {
  private Et0: number;
  private precipitation: number;
  public readonly Kc: number;
  public readonly plantingDate: string;
  private irrigationSystem: IrrigationSystemEntity;

  public readonly Etc: number = 0;
  public readonly irrigationTime: string;
  public readonly repositionBlade: number = 0;
  public readonly velocity: number | null = null;

  private constructor({
    Et0,
    plantingDate,
    precipitation,
    cropCycle,
    irrigationSystem,
    cropDay
  }: BladeSuggestionProps) {
    this.Et0 = Et0;
    this.precipitation = precipitation;
    this.plantingDate = plantingDate;
    this.Kc = this.calcKc(cropDay, cropCycle);
    this.irrigationSystem = irrigationSystem;

    this.Etc = this.calcEtc(this.Et0, this.Kc);

    this.repositionBlade = this.calcRepositionBlade(
      this.Etc,
      this.precipitation,
      this.irrigationSystem.efficiency
    );

    if (this.irrigationSystem.type === 'Pivô Central') {
      const measurements = this.irrigationSystem.measurements as Pivot
      measurements.setVelocity(this.repositionBlade)

      this.irrigationTime = decimalToHoursAndMinutes(measurements.calcOperatingTime())
      this.velocity = measurements.Velocity

      return
    }
    /**
     *  Pivô Central: Obtenção do número de voltas necessárias para a reposição
     *  Em outros tipos de sistemas a saída será em horas
     */
    this.irrigationTime = this.calcIrrigationTime(
      this.repositionBlade,
      this.irrigationSystem.applicationRate
    )
  }

  private calcEtc(Eto: number, kc: number) {
    return Eto * kc;
  }

  private calcIrrigationTime(repositionBlade: number, applicationRate: number) {
    return decimalToHoursAndMinutes(repositionBlade / applicationRate)
  }

  private calcKc(cropDay: number, cropCycle: ManagementCropCycle) {
    return (cropDay - cropCycle.Start) * cropCycle.Increment + cropCycle.KC
  }

  private calcRepositionBlade(
    Etc: number,
    precipitation: number,
    efficiency: number
  ) {
    const EtcMinusPrecipitation = Etc - precipitation

    if (EtcMinusPrecipitation < 0) {
      return 0
    }
    return EtcMinusPrecipitation / efficiency;
  }

  static create(props: {
    Et0: number;
    precipitation: number;
    plantingDate: string;
    cropCycle: ManagementCropCycle;
    irrigationSystem: IrrigationSystemEntity;
    cropDay: number;
  }) {
    const bladeSuggestion = new BladeSuggestion({
      cropCycle: props.cropCycle,
      Et0: props.Et0,
      irrigationSystem: props.irrigationSystem,
      plantingDate: props.plantingDate,
      precipitation: props.precipitation,
      cropDay: props.cropDay
    });

    return bladeSuggestion;
  }
}


