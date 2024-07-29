import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";

export class DeleteNews implements DeleteNewsUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  private readonly queueProvider: TaskSchedulerProviderProtocol;

  constructor(
    repository: NewsRepositoryProtocol,
    queueProvider: TaskSchedulerProviderProtocol
  ) {
    this.repository = repository;
    this.queueProvider = queueProvider;
  }
  async create(
    request: DeleteNewsUseCaseProtocol.Request
  ): DeleteNewsUseCaseProtocol.Response {
    await this.repository.delete(request);

    const successLog = `Notícia deletada com sucessso.`;

    // delete all jobs related to the news (purge by news id)
    await this.queueProvider.removeByKey(String(request.Id));

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
