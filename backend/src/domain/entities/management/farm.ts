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
  IdBasin: number;
  Name: string;
  CensusTakersQtd: number;
  Area: number;
  MonthDuration: number;
  Indicators: Map<CultureIndicatorsNames, CultureIndicatorValues>;
};

const farmManagement: Culture = {
  Id_Culture: 1,
  IdBasin: 1,
  Area: 1,
  CensusTakersQtd: 1,
  MonthDuration: 1,
  Name: "a",
  Indicators: new Map<CultureIndicatorsNames, CultureIndicatorValues>([
    [
      "Productivity",
      {
        Unity: "x",
        Value: 1,
      },
    ],
    [
      "Profitability",
      {
        Unity: "x",
        Value: 1,
      },
    ],
    [
      "WaterConsumption",
      {
        Unity: "x",
        Value: 1,
      },
    ],
    [
      "Jobs",
      {
        Unity: "x",
        Value: 1,
      },
    ],
  ]),
};
