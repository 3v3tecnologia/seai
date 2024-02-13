import { CultureWeightsToPersistency } from "../../../use-cases/_ports/repositories/management-weights.repository";
import { ManagementWeights } from "../weights";

export class CultureWeightsMapper {
  static toDomain(row: any): ManagementWeights {
    return new ManagementWeights({
      id_basin: Number(row.Id_Basin),
      id_culture: Number(row.Id_Culture),
      productivity: [
        {
          value: Number(row.ProductivityPerKilo) || null,
          unity: "Kg/ha",
        },
        {
          value: Number(row.ProductivityPerMeters) || null,
          unity: "kg/m³",
        },
      ],
      profitability: [
        {
          value: Number(row.ProfitabilityPerHectare) || null,
          unity: "R$/ha",
        },
        {
          value: Number(row.ProfitabilityPerMeters) || null,
          unity: "R$/m³",
        },
      ],
      jobs: [
        {
          value: Number(row.JobsPerMeters) || null,
          unity: "1000m³",
        },
        {
          value: Number(row.JobsPerHectare) || null,
          unity: "ha",
        },
      ],
      waterConsumption: [
        {
          value: Number(row.WaterConsumptionPerMeters) || null,
          unity: "m",
        },
        {
          value: Number(row.WaterConsumptionPerHectare) || null,
          unity: "ha",
        },
      ],
    });
  }

  static toPersistency(
    weights: Array<ManagementWeights>
  ): Array<CultureWeightsToPersistency> {
    return weights.map((weight) => ({
      Id_Basin: weight.idBasin,
      Id_Culture: weight.idCulture,
      ProductivityPerKilo: weight.productivity[0].value,
      ProductivityPerMeters: weight.productivity[1].value,
      ProfitabilityPerHectare: weight.profitability[0].value,
      ProfitabilityPerMeters: weight.profitability[1].value,
      JobsPerMeters: weight.jobs[0].value,
      JobsPerHectare: weight.jobs[1].value,
      WaterConsumptionPerHectare: weight.waterConsumption[0].value,
      WaterConsumptionPerMeters: weight.waterConsumption[1].value,
    }));
  }
}
