import { ManagementWeights } from "../../src/domain/entities/management/weights";

export class ManagementCultureBuilder {
  private culture: ManagementWeights = {
    Id_Basin: 1,
    Id_Culture: 1,
    Productivity: [
      {
        Value: 0.5,
        Unity: "Kg/ha",
      },
      {
        Value: 0.5,
        Unity: "kg/m³",
      },
    ],
    Profitability: [
      {
        Value: 0.5,
        Unity: "R$/ha",
      },
      {
        Value: 0.5,
        Unity: "R$/m³",
      },
    ],
    Jobs: [
      {
        Value: 0.5,
        Unity: "1000m³",
      },
      {
        Value: 0.5,
        Unity: "ha",
      },
    ],
    WaterConsumption: [
      {
        Value: 0.5,
        Unity: "m",
      },
      {
        Value: 0.5,
        Unity: "ha",
      },
    ],
    R: null,
    WaterCut: null
  };

  public withNullIndicators(){
    this.culture.Productivity =  [
      {
        Value: null,
        Unity: "R$/ha",
      },
      {
        Value: null,
        Unity: "R$/m³",
      },
    ]

    this.culture.WaterConsumption =  [
      {
        Value: null,
        Unity: "R$/ha",
      },
      {
        Value: null,
        Unity: "R$/m³",
      },
    ]

    this.culture.Profitability = [
      {
        Value: null,
        Unity: "R$/ha",
      },
      {
        Value: null,
        Unity: "R$/m³",
      },
    ]

    this.culture.Jobs = [
      {
        Value: null,
        Unity: "1000m³",
      },
      {
        Value: null,
        Unity: "ha",
      },
    ]
  }

  static create(): ManagementCultureBuilder {
    return new ManagementCultureBuilder();
  }

  public build(): ManagementWeights {
    return this.culture;
  }
}
