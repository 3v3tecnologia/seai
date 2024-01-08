import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class DeleteJob {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: DeleteJobUseCaseProtocol.Request
  ): Promise<Either<Error, DeleteJobUseCaseProtocol.Response>> {
    const job = await this.repository.getJobById(request.Id);

    if (job == null) {
      return left(
        new Error(`Não foi possível encontrar job com id ${request.Id}`)
      );
    }

    const data = await this.repository.deleteJob({
      Id: request.Id,
    });

    return right(data);
  }
}

export namespace DeleteJobUseCaseProtocol {
  export type Request = {
    Id: string;
  };

  export type Response = any;
}
