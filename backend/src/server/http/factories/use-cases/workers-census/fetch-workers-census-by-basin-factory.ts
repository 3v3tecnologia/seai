import { FetchWorkersCensusByBasin } from "../../../../../domain/use-cases/workers-census/fetch-workers-census-by-basin";
import { KnexWorkersCensusRepository } from "../../../../../infra/database/postgres/repositories/worker-census-repository";

export const makeFetchWorkersCensusCensusByBasin =
  (): FetchWorkersCensusByBasin => {
    const repository = new KnexWorkersCensusRepository();
    return new FetchWorkersCensusByBasin(repository);
  };
