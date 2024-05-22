import { Either, right } from "../../../shared/Either";
import {
  EconomicSecurityByCountyData,
  IndicatorsRepositoryProtocol,
} from "../_ports/repositories/census-security-indicators.repository";

export class FetchEconomicSecurityCensusByCounty {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<Error, Array<EconomicSecurityByCountyData> | null>
  > {
    const data =
      await this.indicatorsCensusRepository.getEconomicSecurityByCounty();
    return right(data);
  }
}
