import { ManagementCropCycle } from "./crop-cycles";
import { IrrigationSystemEntity } from "./irrigation-system";
import { Pivot } from "./irrigation-system-measurements";

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
  public readonly irrigationTime: string;
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
      this.precipitation,
      this.irrigationSystem.efficiency
    );
    const irrigationTime = this.calcIrrigationTime(
      this.repositionBlade,
      this.irrigationSystem.applicationRate
    );

    /**
     *  Pivô Central: Obtenção do número de voltas necessárias para a reposição
     *  Em outros tipos de sistemas a saída será em horas
     */
    this.irrigationTime =
      this.irrigationSystem instanceof Pivot
        ? decimalToPivotLaps(irrigationTime)
        : decimalToHoursAndMinutes(irrigationTime);
  }

  private calcEtc(Eto: number, kc: number) {
    return Eto * kc;
  }

  private calcIrrigationTime(repositionBlade: number, applicationRate: number) {
    return repositionBlade / applicationRate;
  }

  private calcRepositionBlade(
    Etc: number,
    precipitation: number,
    efficiency: number
  ) {
    console.log({
      Etc,
      precipitation,
      efficiency,
    });
    return (Etc - precipitation) / efficiency;
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

function decimalToPivotLaps(decimalTime: number) {
  const laps = Math.ceil(decimalTime);
  return `${laps} volta(s)`;
}

function decimalToHoursAndMinutes(decimalTime: number) {
  const date = new Date(0, 0);
  date.setSeconds(decimalTime * 60 * 60);

  // Extract hours and minutes
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the result
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}Hrs ${formattedMinutes}Min`;
}
