import {
  FetchAquacultureCensusByBasin,
  FetchCaptationTankCensusByCounty,
} from "../../../../../domain/use-cases/census";
import { FetchAquacultureCensusByCounty } from "../../../../../domain/use-cases/census/fetch-aquaculture-by-county";
import { FetchCaptationTankCensusByBasin } from "../../../../../domain/use-cases/census/fetch-captation-tank-by-basin";
import { DbAquacultureCensusRepository } from "../../../../../infra/database/postgres/repositories/aquaculture-census-repository";

export class AquacultureUseCasesFactory {
  private static repository = new DbAquacultureCensusRepository();

  static makeFetchCaptationTankCensusByBasin(): FetchCaptationTankCensusByBasin {
    return new FetchCaptationTankCensusByBasin(this.repository);
  }

  static makeFetchCaptationTankCensusByCounty(): FetchCaptationTankCensusByCounty {
    return new FetchCaptationTankCensusByCounty(this.repository);
  }

  static makeFetchAquacultureCensusByBasin(): FetchAquacultureCensusByBasin {
    return new FetchAquacultureCensusByBasin(this.repository);
  }

  static makeFetchAquacultureCensusByCounty(): FetchAquacultureCensusByCounty {
    return new FetchAquacultureCensusByCounty(this.repository);
  }
}
