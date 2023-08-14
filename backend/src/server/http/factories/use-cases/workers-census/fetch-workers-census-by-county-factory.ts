import { FetchWorkersCensusByCounty } from "../../../../../domain/use-cases/workers-census/fetch-workers-census-by-county";
import { KnexWorkersCensusRepository } from "../../../../../infra/database/postgres/repositories/worker-census-repository";

export const makeFetchWorkersCensusCensusByCounty =
  (): FetchWorkersCensusByCounty => {
    const repository = new KnexWorkersCensusRepository();
    return new FetchWorkersCensusByCounty(repository);
  };
