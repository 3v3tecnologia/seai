export type ManagementWeightIndicatorValue = {
  value: number | null;
  unity: string;
};
export interface ManagementWeightsProtocol {
  id_basin: number;
  id_culture: number;
  productivity: Array<ManagementWeightIndicatorValue>;
  profitability: Array<ManagementWeightIndicatorValue>;
  jobs: Array<ManagementWeightIndicatorValue>;
  waterConsumption: Array<ManagementWeightIndicatorValue>;
}

export class ManagementWeights {
  private _idBasin: number;
  private _idCulture: number;
  private _productivity: Array<ManagementWeightIndicatorValue>;
  private _profitability: Array<ManagementWeightIndicatorValue>;
  private _jobs: Array<ManagementWeightIndicatorValue>;
  private _waterConsumption: Array<ManagementWeightIndicatorValue>;
  private _average: number;
  private _waterCut: number;

  constructor(props: ManagementWeightsProtocol) {
    this._idBasin = props.id_basin;
    this._idCulture = props.id_culture;
    // TO-DO : Improve the weights indicators data structure
    this._jobs = props.jobs;
    this._productivity = props.productivity;
    this._profitability = props.profitability;
    this._waterConsumption = props.waterConsumption;

    this._average = ManagementWeights.calcAverage([
      ...this.jobs,
      ...this.productivity,
      ...this.profitability,
      ...this.waterConsumption,
    ]);

    this._waterCut = ManagementWeights.calcWaterCut(this._average);
  }

  public get idBasin() {
    return this._idBasin;
  }

  public get idCulture() {
    return this._idCulture;
  }

  public get productivity() {
    return this._productivity;
  }
  public get profitability() {
    return this._profitability;
  }
  public get waterConsumption() {
    return this._waterConsumption;
  }
  public get jobs() {
    return this._jobs;
  }

  public static calcAverage(
    indicators: ManagementWeightIndicatorValue[]
  ): number {
    return (
      indicators.reduce((prev, current) => {
        if (current.value) {
          return (prev += current.value);
        }

        return 0;
      }, 0) / indicators.length
    );
  }

  public static calcWaterCut(average: number) {
    return (average - 1) * 100;
  }
}
