import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NotExistsError } from "../errors/notFound-error";

export class UpdateJob implements UpdateJobUseCaseProtocol.UseCase {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: UpdateJobUseCaseProtocol.Request
  ): Promise<Either<NotExistsError | Error, any | null>> {
    const job = await this.repository.getJobById(request.Id);

    if (job == null) {
      return left(
        new NotExistsError(
          `Não foi possível encontrar job com id ${request.Id}`
        )
      );
    }

      await this.repository.updateJob(request);

    return right(`Sucesso ao atualizar job ${request.Id}`);
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

  export interface UseCase {
    execute(
      request: UpdateJobUseCaseProtocol.Request
    ): Promise<Either<Error, any | null>>;
  }
}
