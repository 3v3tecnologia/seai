import { ManagementCropCycle } from "./crop-cycles";
import { IrrigationSystemEntity } from "./irrigation-system";

export type BladeSuggestionProps = {
  Et0: number;
  precipitation: number;
  Kc: number;
  plantingDate: string;
  irrigationSystem: IrrigationSystemEntity;
};

export class BladeSuggestion {
  private Et0: number;
  // precipitação, é que ficou faltando eu colocar no documento
  // mas ela é para subtrair da lâmina de reposição, aí se der menor q 0, a reposição é para ser 0, é tipo, "choveu mais do q precisava"
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
      this.Etc,
      this.irrigationSystem.efficiency
    );
    //  [Dúvida] Como converter para tempo?
    this.irrigationTime = this.calcIrrigationTime(
      this.repositionBlade,
      this.irrigationSystem.applicationRate
    );
  }

  private calcEtc(Eto: number, kc: number) {
    return Eto * kc;
  }

  private calcIrrigationTime(repositionBlade: number, applicationRate: number) {
    return repositionBlade / applicationRate;
  }

  private calcRepositionBlade(Etc: number, efficiency: number) {
    return Etc * efficiency;
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
