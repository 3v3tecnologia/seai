import { Either, right } from "../../../shared/Either";
import {
  EconomicSecurityByBasinData,
  IndicatorsRepositoryProtocol,
} from "../infra/repositories/protocols/census-security-indicators.repository";

export class FetchEconomicSecurityCensusByBasin {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<Error, Array<EconomicSecurityByBasinData> | null>
  > {
    const data =
      await this.indicatorsCensusRepository.getEconomicSecurityByBasin();

    return right(data);
  }
}
