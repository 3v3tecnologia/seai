import { NewsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { DeleteJobByKeyUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { Either, right } from "../../../shared/Either";

export class DeleteNews implements DeleteNewsUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  private readonly deleteJobByKey: DeleteJobByKeyUseCaseProtocol.UseCase;

  constructor(
    repository: NewsRepositoryProtocol,
    deleteJobByKey: DeleteJobByKeyUseCaseProtocol.UseCase
  ) {
    this.repository = repository;
    this.deleteJobByKey = deleteJobByKey;
  }
  async create(
    request: DeleteNewsUseCaseProtocol.Request
  ): DeleteNewsUseCaseProtocol.Response {
    await this.repository.delete(request);

    const successLog = `Notícia deletada com sucessso.`;

    // delete all jobs related to the news (purge by news id)
    await this.deleteJobByKey.execute({
      key: String(request.Id),
    });

    return right(successLog);
  }
}

export namespace DeleteNewsUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
