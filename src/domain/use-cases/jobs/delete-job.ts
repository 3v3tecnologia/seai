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
    const job = await this.repository.getJobById(request.id);

    if (job == null) {
      return left(
        new NotExistsError(
          `Não foi possível encontrar job com id ${request.id}`
        )
      );
    }

    await this.repository.deleteJob({
      id: request.id,
    });

    return right(`Sucesso ao deletar job ${request.id}`);
  }
}

export namespace DeleteJobUseCaseProtocol {
  export type Request = {
    id: string;
  };

  export type Response = any;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<NotExistsError, DeleteJobUseCaseProtocol.Response>>;
  }
}
