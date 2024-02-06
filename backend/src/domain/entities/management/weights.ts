export type ManagementWeightIndicatorValue = {
  Value: number | null;
  Unity: string;
};
export interface ManagementWeights {
  Id_Basin: number;
  Id_Culture: number;
  Productivity: Array<ManagementWeightIndicatorValue>;
  Profitability: Array<ManagementWeightIndicatorValue>;
  Jobs: Array<ManagementWeightIndicatorValue>;
  WaterConsumption: Array<ManagementWeightIndicatorValue>;
}
