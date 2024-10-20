import { CropStudies } from "../../../core/model/crop-studies";

export class CropStudiesMapper {
  static toDomain(row: any): CropStudies {
    return {
      id_basin: row.bacia_id,
      crop: row.cultura,
      harvest_duration_in_months: Number(row.safra_meses),
      cultivation_period_in_days: Number(row.cultivo_dias),
      consumption: Number(row.consumohidrico),
      productivity: Number(row.produtividade),
      year: Number(row.year),
    };
  }

  static toPersistency(study: CropStudies, idBasin?: number): any {
    return {
      bacia_id: idBasin || study.id_basin,
      cultura: study.crop,
      safra_meses: Number(study.harvest_duration_in_months),
      cultivo_dias: Number(study.cultivation_period_in_days),
      consumohidrico: Number(study.consumption),
      produtividade: Number(study.productivity),
      year: Number(study.year),
    };
  }
}
