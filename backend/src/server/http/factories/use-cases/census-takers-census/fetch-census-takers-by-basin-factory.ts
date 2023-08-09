import { FetchCensusTakersCensusByBasin } from "../../../../../domain/use-cases/census-takers/fetch-census-takers-by-basin";
import { KnexCensusTakersRepository } from "../../../../../infra/database/postgres/repositories/census-takers-census-repository";

export const makeFetchCensusTakersCensusByBasin =
  (): FetchCensusTakersCensusByBasin => {
    const repository = new KnexCensusTakersRepository();
    return new FetchCensusTakersCensusByBasin(repository);
  };
