import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class UpdateJob {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: UpdateJobUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    const job = await this.repository.getJobById(request.Id);

    if (job == null) {
      return left(
        new Error(`Não foi possível encontrar job com id ${request.Id}`)
      );
    }

    const data = await this.repository.createJob(request);

    return right(data);
  }
}

export namespace UpdateJobUseCaseProtocol {
  export type Request = {
    Id: string;
    Queue: string;
    Priority: number;
    RetryLimit: number;
    RetryDelay: number;
    Data: any;
  };

  export type Response = string;
}
