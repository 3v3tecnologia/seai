export type ManagementWeightIndicatorValue = {
  Value: number | null;
  Unity: string;
};
export interface ManagementWeightsProtocol {
  Id_Basin: number;
  Id_Culture: number;
  Productivity: Array<ManagementWeightIndicatorValue>;
  Profitability: Array<ManagementWeightIndicatorValue>;
  Jobs: Array<ManagementWeightIndicatorValue>;
  WaterConsumption: Array<ManagementWeightIndicatorValue>;
  // R: number | null;
  // WaterCut: number | null;
}

export class ManagementWeights{
  private _props:ManagementWeightsProtocol;
  private _average:number;
  private _waterCut:number;
  
  constructor(props:ManagementWeightsProtocol){
    this._props = props
    this._average = ManagementWeights.calAverage(this);
    this._waterCut = ManagementWeights.calcWaterCut(this._average);
  }

  public getProductivity(){
    return this._props.Productivity
  }
  public getProfitability(){
    return this._props.Profitability
  }
  public getWaterConsumption(){
    return this._props.WaterConsumption
  }
  public getJobs(){
    return this._props.Jobs
  }

  static calAverage(data:ManagementWeights){
    const indicators = [
      ...data.getJobs(),
      ...data.getProductivity(),
      ...data.getProfitability(),
      ...data.getWaterConsumption(),
    ];

    return indicators.reduce((prev, current) => {
      if (current.Value) {
        return (prev += current.Value);
      }

      return 0;
    }, 0) / indicators.length;
  }

  static calcWaterCut(average:number){
    return (average - 1) * 100;
  }
}
