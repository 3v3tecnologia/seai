import { WaterCut } from "../../core/model/water-cut";

export class WaterCutMapper {
  static toDomain(row: any): WaterCut {
    return {
      id_basin: row.bacia_id,
      crop: row.cultura,
      water_cut: row.corte_hidrico,  
      // year: Number(row.year),
    };
  }

}