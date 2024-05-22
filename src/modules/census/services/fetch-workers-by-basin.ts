import { Either, right } from "../../../shared/Either";
import { WorkersCensusRepositoryProtocol } from "../_ports/repositories/workers-census-repository";

export class FetchWorkersCensusByBasin {
  private readonly repository: WorkersCensusRepositoryProtocol;

  constructor(repository: WorkersCensusRepositoryProtocol) {
    this.repository = repository;
  }
  async execute(): Promise<Either<Error, Array<any> | null>> {
    const data = await this.repository.getByBasin();

    return right(data);
  }
}
