import { ManagementWeights } from "../../src/domain/entities/management/weights";

export class ManagementCultureBuilder {
  private culture: ManagementWeights = {
    Id_Basin: 1,
    Id_Culture: 1,
    Productivity: [
      {
        Value: 1,
        Unity: "Kg/ha",
      },
      {
        Value: 5,
        Unity: "kg/m³",
      },
    ],
    Profitability: [
      {
        Value: 2,
        Unity: "R$/ha",
      },
      {
        Value: 5,
        Unity: "R$/m³",
      },
    ],
    Jobs: [
      {
        Value: 2,
        Unity: "1000m³",
      },
      {
        Value: 3,
        Unity: "ha",
      },
    ],
    WaterConsumption: [
      {
        Value: 2,
        Unity: "m",
      },
      {
        Value: 1,
        Unity: "ha",
      },
    ],
  };

  static create(): ManagementCultureBuilder {
    return new ManagementCultureBuilder();
  }

  public build(): ManagementWeights {
    return this.culture;
  }
}
