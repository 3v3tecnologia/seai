import { FetchAquacultureCensusByCounty } from "../../../../../domain/use-cases/aquaculture-census/fetch-aquaculture-census-by-county";
import { KnexAquacultureCensusRepository } from "../../../../../infra/database/postgres/repositories/aquaculture-census-repository";

export const makeFetchAquacultureCensusByCounty =
  (): FetchAquacultureCensusByCounty => {
    const repository = new KnexAquacultureCensusRepository();
    return new FetchAquacultureCensusByCounty(repository);
  };
