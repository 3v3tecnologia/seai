import { ManagementWeights } from "../../src/domain/entities/management/weights";

export class ManagementCultureBuilder {
  private culture: ManagementWeights = new ManagementWeights({
    id_basin: 1,
    id_culture: 1,
    productivity: [
      {
        value: 0.5,
        unity: "Kg/ha",
      },
      {
        value: 0.5,
        unity: "kg/m³",
      },
    ],
    profitability: [
      {
        value: 0.5,
        unity: "R$/ha",
      },
      {
        value: 0.5,
        unity: "R$/m³",
      },
    ],
    jobs: [
      {
        value: 0.5,
        unity: "1000m³",
      },
      {
        value: 0.5,
        unity: "ha",
      },
    ],
    waterConsumption: [
      {
        value: 0.5,
        unity: "m",
      },
      {
        value: 0.5,
        unity: "ha",
      },
    ],
  });

  static create(): ManagementCultureBuilder {
    return new ManagementCultureBuilder();
  }

  public build(): ManagementWeights {
    return this.culture;
  }
}
