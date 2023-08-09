import { Either, right } from "../../../shared/Either";
import {
  IndicatorsRepositoryProtocol,
  SocialSecurityByCountyData,
} from "../_ports/repositories/indicators-census-repository";

export class FetchSocialSecurityCensusByCounty {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<Error, Array<SocialSecurityByCountyData> | null>
  > {
    const data =
      await this.indicatorsCensusRepository.getSocialSecurityByCounty();
    return right(data);
  }
}
