import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class CreateJob implements CreateJobUseCaseProtocol.UseCase {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: CreateJobUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    const data = await this.repository.createJob(request);

    return right(data);
  }
}

export namespace CreateJobUseCaseProtocol {
  export type Request = {
    queue: string;
    priority: number;
    retryLimit: number;
    retryDelay: number;
    data: any;
  };

  export type Response = string;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}