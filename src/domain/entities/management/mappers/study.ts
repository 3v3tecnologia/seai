import { ManagementCensusStudy } from "../study";

export class ManagementStudyMapper {
  static toDomain(row: any): ManagementCensusStudy {
    return {
      Id_Basin: Number(row.Id_Basin),
      Culture: Number(row.Culture),
      Harvest: Number(row.Harvest),
      Farm: Number(row.Farm),
      Productivity: [
        {
          Value: Number(row.ProductivityPerKilo),
          Unity: "kg/ha",
        },
        {
          Value: Number(row.ProductivityPerMeters),
          Unity: "m³/ha",
        },
      ],
    };
  }

  static toPersistency(study: ManagementCensusStudy): any {
    return {
      Id_Basin: study.Id_Basin,
      Culture: study.Culture,
      Harvest: study.Harvest,
      Farm: study.Farm,
      ProductivityPerKilo: study.Productivity[0].Value,
      ProductivityPerMeters: study.Productivity[1].Value,
    };
  }
}
