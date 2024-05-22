import { Either, right } from "../../../shared/Either";
import { IndicatorsRepositoryProtocol } from "../infra/repositories/protocols/census-security-indicators.repository";

export class FetchProductivitySecurityCensusByBasin {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<Either<Error, Array<any> | null>> {
    const data =
      await this.indicatorsCensusRepository.getProductivitySecurityByBasin();
    return right(data);
  }
}
