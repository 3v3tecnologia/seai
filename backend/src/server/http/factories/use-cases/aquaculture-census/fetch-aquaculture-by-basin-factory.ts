import { FetchAquacultureCensusByBasin } from "../../../../../domain/use-cases/aquaculture-census/fetch-aquaculture-census-by-basin";
import { KnexAquacultureCensusRepository } from "../../../../../infra/database/postgres/repositories/aquaculture-census-repository";

export const makeFetchAquacultureCensusByBasin =
  (): FetchAquacultureCensusByBasin => {
    const repository = new KnexAquacultureCensusRepository();
    return new FetchAquacultureCensusByBasin(repository);
  };
