export type CensusCultureWeights = {
  id_basin: number,
  crop: string,
  productivity_ha: number,
  productivity_m3: number,
  profitability_ha: number,
  profitability_m3: number,
  jobs_ha: number,
  jobs_1000m3: number,
  water_consumption: number,
  crop_cycle: number,
  year: number
}

/*export interface ManagementWeightsProtocol {
  id_basin: number;
  culture: string;
  productivity: Map<"Kg/ha" | "kg/m³", number>;
  profitability: Map<"R$/ha" | "R$/m³", number>;
  jobs: Map<"1000m³" | "ha", number>;
  waterConsumption: Map<"m³/ha", number>;
}*/


/*
export class CultureWeights {
  private _idBasin: number;
  private _culture: string;
  private _productivity: Map<"Kg/ha" | "kg/m³", number>;
  private _profitability: Map<"R$/ha" | "R$/m³", number>;
  private _jobs: Map<"1000m³" | "ha", number>;
  private _waterConsumption: Map<"m³/ha", number>;
  private _average: number;
  private _waterCut: number;

  constructor(props: ManagementWeightsProtocol) {
    this._idBasin = props.id_basin;
    this._culture = props.culture;
    // TO-DO : Improve the weights indicators data structure
    this._jobs = props.jobs;
    this._productivity = props.productivity;
    this._profitability = props.profitability;
    this._waterConsumption = props.waterConsumption;

    this._average = CultureWeights.calcAverage([
      ...this.jobs.values(),
      ...this.productivity.values(),
      ...this.profitability.values(),
      ...this.waterConsumption.values(),
    ]);

    this._waterCut = CultureWeights.calcWaterCut(this._average);
  }

  public get idBasin() {
    return this._idBasin;
  }

  public get culture() {
    return this._culture;
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

  public get waterCut() {
    return this._waterCut;
  }

  public get indicators() {
    return [
      this._jobs,
      this._productivity,
      this._profitability,
      this._waterConsumption,
    ];
  }

  public static calcAverage(indicators: number[]): number {
    return (
      indicators.reduce((prev, current) => {
        if (current) {
          return (prev += current);
        }

        return 0;
      }, 0) / indicators.length
    );
  }

  public static calcWaterCut(average: number) {
    return Math.abs(average - 1) * 100;
  }
}
*/