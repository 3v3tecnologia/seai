import { FetchAnimalsCensusByConsumption } from "../../../../../domain/use-cases/animal-census/fetch-consume/fetch-by-consumption";
import { KnexAnimalsCensusRepository } from "../../../../../infra/database/postgres/repositories/animals-census-repository";

export const makeFetchAnimalsCensusConsumption =
  (): FetchAnimalsCensusByConsumption => {
    const accountRepository = new KnexAnimalsCensusRepository();
    return new FetchAnimalsCensusByConsumption(accountRepository);
  };
