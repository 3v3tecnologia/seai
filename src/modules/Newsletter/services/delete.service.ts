import {
  CommandProps,
  UserOperationsLoggerProtocol,
} from "./../../UserOperations/protocols/logger";
import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";

export class DeleteNews implements DeleteNewsUseCaseProtocol.UseCase {
  constructor(
    private readonly repository: NewsRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol,
    private readonly operationsLogger: UserOperationsLoggerProtocol
  ) {}
  async create(
    request: DeleteNewsUseCaseProtocol.Request
  ): DeleteNewsUseCaseProtocol.Response {
    await this.repository.delete(request);

    await this.operationsLogger.save(request.accountId, request.description);

    const successLog = `Notícia deletada com sucessso.`;

    // delete all jobs related to the news (purge by news id)
    await this.queueProvider.removeByKey(String(request.Id));

    return right(successLog);
  }
}

export namespace DeleteNewsUseCaseProtocol {
  export type Request = {
    Id: number;
  } & CommandProps;

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
