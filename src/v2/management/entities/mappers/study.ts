import { CensusStudy } from "../study";

export class CensusStudyMapper {
  static toDomain(row: any): CensusStudy {
    return {
      Id_Basin: Number(row.Id_Basin),
      Crop: row.Crop,
      HarvestDuration: Number(row.HarvestDuration),
      CultivationPeriod: Number(row.CultivationPeriod),
      Consumption: Number(row.Consumption),
      Productivity: Number(row.Productivity),
    };
  }

  static toPersistency(study: CensusStudy): any {
    return {
      Id_Basin: study.Id_Basin,
      Crop: study.Crop,
      HarvestDuration: study.HarvestDuration,
      CultivationPeriod: study.CultivationPeriod,
      Consumption: study.Consumption,
      Productivity: study.Productivity,
    };
  }
}
