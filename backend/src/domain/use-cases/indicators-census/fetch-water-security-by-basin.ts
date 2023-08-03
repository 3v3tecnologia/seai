import { Either, right } from "../../../shared/Either";
import {
  IndicatorsRepositoryProtocol,
  WaterSecurityByBasinData,
} from "../_ports/repositories/indicators-census-repository";

export class FetchWaterSecurityCensusByBasin {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<Error, Array<WaterSecurityByBasinData> | null>
  > {
    const data =
      await this.indicatorsCensusRepository.getWaterSecurityByBasin();
    return right(data);
  }
}
