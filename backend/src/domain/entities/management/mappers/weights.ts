import { CultureWeightsToPersistency } from "../../../use-cases/_ports/repositories/management-weights.repository";
import { ManagementWeights } from "../weights";

export class CultureWeightsMapper {
  static toDomain(row: any): ManagementWeights {
    return {
      Id_Basin: Number(row.Id_Basin),
      Id_Culture: Number(row.Id_Culture),
      Productivity: [
        {
          Value: Number(row.ProductivityPerKilo) || null,
          Unity: "Kg/ha",
        },
        {
          Value: Number(row.ProductivityPerMeters) || null,
          Unity: "kg/m³",
        },
      ],
      Profitability: [
        {
          Value: Number(row.ProfitabilityPerHectare) || null,
          Unity: "R$/ha",
        },
        {
          Value: Number(row.ProfitabilityPerMeters) || null,
          Unity: "R$/m³",
        },
      ],
      Jobs: [
        {
          Value: Number(row.JobsPerMeters) || null,
          Unity: "1000m³",
        },
        {
          Value: Number(row.JobsPerHectare) || null,
          Unity: "ha",
        },
      ],
      WaterConsumption: [
        {
          Value: Number(row.WaterConsumptionPerMeters) || null,
          Unity: "m",
        },
        {
          Value: Number(row.WaterConsumptionPerHectare) || null,
          Unity: "ha",
        },
      ],
      R: null,
      WaterCut: null
    };
  }

  static toPersistency(
    weights: Array<ManagementWeights>
  ): Array<CultureWeightsToPersistency> {
    return weights.map((weight) => ({
      Id_Basin: weight.Id_Basin,
      Id_Culture: weight.Id_Culture,
      ProductivityPerKilo: weight.Productivity[0].Value,
      ProductivityPerMeters: weight.Productivity[1].Value,
      ProfitabilityPerHectare: weight.Profitability[0].Value,
      ProfitabilityPerMeters: weight.Profitability[1].Value,
      JobsPerMeters: weight.Jobs[0].Value,
      JobsPerHectare: weight.Jobs[1].Value,
      WaterConsumptionPerHectare: weight.WaterConsumption[0].Value,
      WaterConsumptionPerMeters: weight.WaterConsumption[1].Value,
    }));
  }
}
