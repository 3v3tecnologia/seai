import { FetchCaptationCensusByBasin } from "../../../../../domain/use-cases/captation-census/fetch-captation-census-by-basin";
import { KnexCaptationCensusRepository } from "../../../../../infra/database/postgres/repositories/captation-repository";

export const makeFetchCaptationCensusByBasin =
  (): FetchCaptationCensusByBasin => {
    const repository = new KnexCaptationCensusRepository();
    return new FetchCaptationCensusByBasin(repository);
  };
