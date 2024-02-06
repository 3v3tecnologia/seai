import {
  Culture,
  CultureIndicatorValues,
  CultureIndicatorsNames,
} from "../../../src/domain/entities/management/farm";

// Farms indicators by basin
export class InMemoryFarmRepository {
  async getByBasin(id: number): Promise<Array<Culture>> {
    return [
      {
        Id_Culture: 1,
        Id_Basin: 1,
        Area: 1,
        CensusTakersQtd: 1,
        MonthDuration: 1,
        Name: "Abacate",
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
      },
      {
        Id_Culture: 2,
        Id_Basin: 1,
        Area: 1,
        CensusTakersQtd: 1,
        MonthDuration: 1,
        Name: "Limão",
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
      },
    ];
  }
}
