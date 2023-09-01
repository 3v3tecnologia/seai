import { Either, right } from "../../../shared/Either";
import {
  CensusCityLocation,
  CensusLocation,
  IndicatorsRepositoryProtocol,
} from "../_ports/repositories/indicators-census-repository";

export class FetchCensusLocations {
  private readonly indicatorsCensusRepository: IndicatorsRepositoryProtocol;

  constructor(indicatorsCensusRepository: IndicatorsRepositoryProtocol) {
    this.indicatorsCensusRepository = indicatorsCensusRepository;
  }
  async execute(): Promise<
    Either<
      Error,
      {
        Bacia: Array<CensusLocation> | null;
        Municipio: Array<CensusCityLocation> | null;
      } | null
    >
  > {
    const basins = await this.indicatorsCensusRepository.getBasin();
    const cities = await this.indicatorsCensusRepository.getCity();

    return right({
      Bacia: basins,
      Municipio: cities,
    });
  }
}
