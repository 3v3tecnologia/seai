import { Either, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class FetchJobsStates implements FetchJobsStatesUseCaseProtocol.UseCase {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(): Promise<
    Either<Error, FetchJobsStatesUseCaseProtocol.Response>
  > {
    const data = await this.repository.getJobsStates();

    return right(data);
  }
}

export namespace FetchJobsStatesUseCaseProtocol {
  export type Request = void;

  export type Response = Array<any> | null;

  export interface UseCase {
    execute(): Promise<Either<Error, FetchJobsStatesUseCaseProtocol.Response>>;
  }
}
