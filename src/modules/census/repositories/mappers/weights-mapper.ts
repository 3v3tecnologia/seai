import { DbCultureWeightsData } from "../model/db-crop-weights";
import { CensusCultureWeights } from "../../core/model/indicators-weights";

export class CultureWeightsMapper {
  static toDomain(row: any): CensusCultureWeights {
    return {
      basin_mask: Number(row.bacia_mascara),
      crop: row.cultura,
      productivity_ha: Number(row.peso_produtividade_ha),
      productivity_m3: Number(row.peso_produtividade_m3),
      profitability_ha: Number(row.peso_rentabilidade_ha),
      profitability_m3: Number(row.peso_rentabilidade_m3),
      jobs_ha: Number(row.peso_empregos_ha),
      jobs_1000m3: Number(row.peso_empregos_1000m3),
      water_consumption: Number(row.peso_consumo_hidrico),
      crop_cycle: Number(row.peso_ciclo_cultura),
      year: Number(row.year),
    };
  }

  static toPersistence(
    weights: CensusCultureWeights,
    mask?: number
  ): DbCultureWeightsData {
    return {
      bacia_mascara: (mask || weights.basin_mask) as number,
      cultura: weights.crop,
      peso_produtividade_ha: weights.productivity_ha ?? null,
      peso_produtividade_m3: weights.productivity_m3 ?? null,
      peso_rentabilidade_ha: weights.profitability_ha ?? null,
      peso_rentabilidade_m3: weights.profitability_m3 ?? null,
      peso_empregos_ha: weights.jobs_ha ?? null,
      peso_empregos_1000m3: weights.jobs_1000m3 ?? null,
      peso_consumo_hidrico: weights.water_consumption ?? null,
      peso_ciclo_cultura: weights.crop_cycle ?? null,
      year: weights.year,
    };
  }
}
