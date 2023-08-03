import { Either, right } from "../../../shared/Either";
import {
  IndicatorsRepositoryProtocol,
  WaterSecurityByCountyData,
} from "../_ports/repositories/indicators-census-repository";

export class FetchWaterSecurityCensusByCounty {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<Error, Array<WaterSecurityByCountyData> | null>
  > {
    const data =
      await this.indicatorsCensusRepository.getWaterSecurityByCounty();
    return right(data);
  }
}
