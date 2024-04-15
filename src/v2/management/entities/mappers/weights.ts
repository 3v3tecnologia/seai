import { CultureWeightsToPersistency } from "../../ports/weights/repository";
import { CultureWeights } from "../weights";

export class CultureWeightsMapper {
  static toDomain(row: any): CultureWeights {
    return new CultureWeights({
      id_basin: Number(row.Id_Basin),
      culture: row.Crop,
      productivity: new Map([
        ["Kg/ha", Number(row.ProductivityPerHectare)],
        ["kg/m³", Number(row.ProductivityPerMeters)],
      ]),
      profitability: new Map([
        ["R$/ha", Number(row.ProfitabilityPerHectare)],
        ["R$/m³", Number(row.ProfitabilityPerMeters)],
      ]),
      jobs: new Map([
        ["1000m³", Number(row.JobsPerMeters)],
        ["ha", Number(row.JobsPerHectare)],
      ]),
      waterConsumption: new Map([["m³/ha", Number(row.WaterConsumption)]]),
    });
  }

  static toPersistency(
    weights: Array<CultureWeights>
  ): Array<CultureWeightsToPersistency> {
    return weights.map((weight) => ({
      Id_Basin: weight.idBasin,
      Culture: weight.culture,
      ProductivityPerHectare: weight.productivity.get("Kg/ha") || null,
      ProductivityPerMeters: weight.productivity.get("kg/m³") || null,
      ProfitabilityPerHectare: weight.profitability.get("R$/ha") || null,
      ProfitabilityPerMeters: weight.profitability.get("R$/m³") || null,
      JobsPerMeters: weight.jobs.get("1000m³") || null,
      JobsPerHectare: weight.jobs.get("ha") || null,
      WaterConsumption: weight.waterConsumption.get("m³/ha") || null,
    }));
  }
}
