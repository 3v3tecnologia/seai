import { FetchCensusTakersCensusByCounty } from "../../../../../domain/use-cases/census-takers/fetch-census-takers-by-county";
import { KnexCensusTakersRepository } from "../../../../../infra/database/postgres/repositories/census-takers-census-repository";

export const makeFetchCensusTakersCensusByCounty =
  (): FetchCensusTakersCensusByCounty => {
    const repository = new KnexCensusTakersRepository();
    return new FetchCensusTakersCensusByCounty(repository);
  };
