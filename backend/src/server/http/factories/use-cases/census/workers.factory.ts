import { FetchWorkersCensusByBasin } from "../../../../../domain/use-cases/census/fetch-workers-by-basin";
import { FetchWorkersCensusByCounty } from "../../../../../domain/use-cases/census/fetch-workers-by-county";
import { DbWorkersCensusRepository } from "../../../../../infra/database/postgres/repositories/worker-census-repository";

export class WorkersCensusUseCasesFactory {
  private static repository = new DbWorkersCensusRepository();

  static makeFetchWorkersCensusCensusByBasin(): FetchWorkersCensusByBasin {
    return new FetchWorkersCensusByBasin(this.repository);
  }

  static makeFetchWorkersCensusCensusByCounty(): FetchWorkersCensusByCounty {
    return new FetchWorkersCensusByCounty(this.repository);
  }
}
