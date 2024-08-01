import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, left, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { UserCommandOperationProps } from "./../../UserOperations/protocols/logger";

export class DeleteNews implements DeleteNewsUseCaseProtocol {
  constructor(
    private readonly repository: NewsRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol
  ) {}
  async execute(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const item = await this.repository.getById(id);

    if (item == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    await this.repository.delete(id, operation);

    const successLog = `Notícia deletada com sucessso.`;

    // delete all jobs related to the news (purge by news id)
    await this.queueProvider.removeByKey(String(id));

    return right(successLog);
  }
}

export interface DeleteNewsUseCaseProtocol {
  execute(
    id: number,
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}
