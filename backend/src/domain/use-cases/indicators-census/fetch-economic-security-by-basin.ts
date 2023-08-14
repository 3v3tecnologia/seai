import { Either, right } from "../../../shared/Either";
import {
  EconomicSecurityByBasinData,
  IndicatorsRepositoryProtocol,
} from "../_ports/repositories/indicators-census-repository";

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
