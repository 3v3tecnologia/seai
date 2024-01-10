import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NotExistsError } from "../errors/notFound-error";

export class DeleteJob implements DeleteJobUseCaseProtocol.UseCase {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: DeleteJobUseCaseProtocol.Request
  ): Promise<Either<NotExistsError, DeleteJobUseCaseProtocol.Response>> {
    const job = await this.repository.getJobById(request.Id);

    if (job == null) {
      return left(
        new NotExistsError(
          `Não foi possível encontrar job com id ${request.Id}`
        )
      );
    }

    const data = await this.repository.deleteJob({
      Id: request.Id,
    });

    return right(`Sucesso ao deletar job ${request.Id}`);
  }
}

export namespace DeleteJobUseCaseProtocol {
  export type Request = {
    Id: string;
  };

  export type Response = any;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<NotExistsError, DeleteJobUseCaseProtocol.Response>>;
  }
}
