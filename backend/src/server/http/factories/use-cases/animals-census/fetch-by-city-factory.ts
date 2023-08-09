import { FetchAnimalsCensusByCity } from "../../../../../domain/use-cases/animal-census/fetch-by-city/fetch-by-city";
import { KnexAnimalsCensusRepository } from "../../../../../infra/database/postgres/repositories/animals-census-repository";

export const makeFetchAnimalsCensusByCity = (): FetchAnimalsCensusByCity => {
  const accountRepository = new KnexAnimalsCensusRepository();
  return new FetchAnimalsCensusByCity(accountRepository);
};
