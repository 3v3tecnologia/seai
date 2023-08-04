import { FetchCaptationCensusByCounty } from "../../../../../domain/use-cases/captation-census/fetch-captation-census-by-county";
import { KnexCaptationCensusRepository } from "../../../../../infra/database/postgres/repositories/captation-repository";

export const makeFetchCaptationCensusByCounty =
  (): FetchCaptationCensusByCounty => {
    const repository = new KnexCaptationCensusRepository();
    return new FetchCaptationCensusByCounty(repository);
  };
