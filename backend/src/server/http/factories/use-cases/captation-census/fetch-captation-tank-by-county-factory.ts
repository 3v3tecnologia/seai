import { FetchCaptationTankCensusByCounty } from "../../../../../domain/use-cases/captation-census/fetch-captation-tank-census-by-county";
import { KnexAquacultureCensusRepository } from "../../../../../infra/database/postgres/repositories/aquaculture-census-repository";

export const makeFetchCaptationTankCensusByCounty =
  (): FetchCaptationTankCensusByCounty => {
    const repository = new KnexAquacultureCensusRepository();
    return new FetchCaptationTankCensusByCounty(repository);
  };
