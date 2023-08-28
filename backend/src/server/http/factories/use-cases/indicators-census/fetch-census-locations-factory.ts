import { FetchCensusLocations } from "../../../../../domain/use-cases/indicators-census/fetch-census-locations";
import { KnexIndicatorsRepository } from "../../../../../infra/database/postgres/repositories/indicators-census-repository";

export const makeFetchCensusLocations = (): FetchCensusLocations => {
  const repository = new KnexIndicatorsRepository();
  return new FetchCensusLocations(repository);
};
