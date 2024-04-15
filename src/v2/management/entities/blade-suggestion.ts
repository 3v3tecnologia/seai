import { ManagementCropCycle } from "./crop-cycles";
import {
  IrrigationSystemEntity,
  irrigationsTypesNames,
} from "./irrigation-system";

export type BladeSuggestionProps = {
  Et0: number;
  precipitation: number;
  Kc: number;
  plantingDate: string;
  irrigationSystem: IrrigationSystemEntity;
};

export class BladeSuggestion {
  private Et0: number;
  private precipitation: number;
  public readonly Kc: number;
  public readonly plantingDate: string;
  private irrigationSystem: IrrigationSystemEntity;

  public readonly Etc: number = 0;
  public readonly irrigationTime: number = 0;
  public readonly repositionBlade: number = 0;

  private constructor({
    Et0,
    plantingDate,
    precipitation,
    Kc,
    irrigationSystem,
  }: BladeSuggestionProps) {
    this.Et0 = Et0;
    this.precipitation = precipitation;
    this.plantingDate = plantingDate;
    this.Kc = Kc;
    this.irrigationSystem = irrigationSystem;

    this.Etc = this.calcEtc(this.Et0, this.Kc);

    this.repositionBlade = this.calcRepositionBlade(
      this.Et0,
      this.Kc,
      this.precipitation,
      this.irrigationSystem.efficiency
    );
    const irrigationTime = this.calcIrrigationTime(
      this.repositionBlade,
      this.irrigationSystem.applicationRate
    );

    // não faz sentido um valor quebrado para o número de voltas
    this.irrigationTime =
      this.irrigationSystem.type === irrigationsTypesNames.Pivot
        ? Math.ceil(irrigationTime)
        : irrigationTime;
  }

  private calcEtc(Eto: number, kc: number) {
    return Eto * kc;
  }

  private calcIrrigationTime(repositionBlade: number, applicationRate: number) {
    return repositionBlade / applicationRate;
  }

  private calcRepositionBlade(
    Eto: number,
    Kc: number,
    precipitation: number,
    efficiency: number
  ) {
    return (Eto * Kc - precipitation) / efficiency;
  }

  static create(props: {
    Et0: number;
    precipitation: number;
    plantingDate: string;
    cropCycle: ManagementCropCycle;
    irrigationSystem: IrrigationSystemEntity;
  }) {
    const bladeSuggestion = new BladeSuggestion({
      Kc: props.cropCycle.KC,
      Et0: props.Et0,
      irrigationSystem: props.irrigationSystem,
      plantingDate: props.plantingDate,
      precipitation: props.precipitation,
    });

    return bladeSuggestion;
  }
}
