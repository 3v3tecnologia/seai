export type CultureIndicatorsNames =
  | "Productivity"
  | "Profitability"
  | "WaterConsumption"
  | "Jobs";

export type CultureIndicatorValues = {
  Value: number | null;
  Unity: string;
};

export type Culture = {
  Id_Culture: number;
  Id_Basin: number;
  Name: string;
  CensusTakersQtd: number;
  Area: number;
  MonthDuration: number;
  Indicators: Map<CultureIndicatorsNames, CultureIndicatorValues>;
};
