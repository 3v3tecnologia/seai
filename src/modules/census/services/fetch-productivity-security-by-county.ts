import { Either, right } from "../../../shared/Either";
import { IndicatorsRepositoryProtocol } from "../infra/repositories/protocols/census-security-indicators.repository";

export class FetchProductivitySecurityCensusByCounty {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<Either<Error, Array<any> | null>> {
    const data =
      await this.indicatorsCensusRepository.getProductivitySecurityByCounty();
    return right(data);
  }
}
