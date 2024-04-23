import { CensusStudy } from "../study";

export class CensusStudyMapper {
  static toDomain(row: any): CensusStudy {
    return {
      Crop: row.Crop,
      HarvestDuration: Number(row.HarvestDuration),
      CultivationPeriod: Number(row.CultivationPeriod),
      Consumption: Number(row.Consumption),
      Productivity: Number(row.Productivity),
    };
  }

  static toPersistency(study: CensusStudy, idBasin: number): any {
    return {
      Id_Basin: idBasin,
      Crop: study.Crop,
      HarvestDuration: study.HarvestDuration,
      CultivationPeriod: study.CultivationPeriod,
      Consumption: study.Consumption,
      Productivity: study.Productivity,
    };
  }
}
