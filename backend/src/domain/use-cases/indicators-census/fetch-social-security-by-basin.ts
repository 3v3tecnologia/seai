import { Either, right } from "../../../shared/Either";
import {
  IndicatorsRepositoryProtocol,
  SocialSecurityByBasinData,
} from "../_ports/repositories/indicators-census-repository";

export class FetchSocialSecurityCensusByBasin {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<Error, Array<SocialSecurityByBasinData> | null>
  > {
    const data =
      await this.indicatorsCensusRepository.getSocialSecurityByBasin();
    return right(data);
  }
}
