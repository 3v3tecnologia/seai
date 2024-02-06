import { ManagementStudyToPersistency } from "../../../use-cases/_ports/repositories/management-studies.repository";
import { ManagementCensusStudy } from "../study";

export class ManagementStudyMapper {
  static toDomain(row: any): ManagementCensusStudy {
    return {
      Id_Basin: Number(row.Id_Basin),
      Id_Culture: Number(row.Id_Culture),
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

  static toPersistency(
    study: ManagementCensusStudy
  ): ManagementStudyToPersistency {
    return {
      Id_Basin: study.Id_Basin,
      Id_Culture: study.Id_Culture,
      Harvest: study.Harvest,
      Farm: study.Farm,
      ProductivityPerKilo: study.Productivity[0].Value,
      ProductivityPerMeters: study.Productivity[1].Value,
    };
  }
}
