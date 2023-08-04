import { FetchCaptationTankCensusByBasin } from "../../../../../domain/use-cases/captation-census/fetch-captation-tank-census-by-basin";
import { KnexAquacultureCensusRepository } from "../../../../../infra/database/postgres/repositories/aquaculture-census-repository";

export const makeFetchCaptationTankCensusByBasin =
  (): FetchCaptationTankCensusByBasin => {
    const repository = new KnexAquacultureCensusRepository();
    return new FetchCaptationTankCensusByBasin(repository);
  };
