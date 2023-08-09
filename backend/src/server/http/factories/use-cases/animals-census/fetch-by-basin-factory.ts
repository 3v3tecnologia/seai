import { FetchAnimalsCensusByBasin } from "../../../../../domain/use-cases/animal-census/fetch-by-basin/fetch-by-basin";
import { KnexAnimalsCensusRepository } from "../../../../../infra/database/postgres/repositories/animals-census-repository";

export const makeFetchAnimalsCensusByBasin = (): FetchAnimalsCensusByBasin => {
  const accountRepository = new KnexAnimalsCensusRepository();
  return new FetchAnimalsCensusByBasin(accountRepository);
};
