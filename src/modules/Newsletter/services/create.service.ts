import { TASK_QUEUES } from "../../../infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, left, right } from "../../../shared/Either";
import {
  CommandProps,
  UserOperationsLoggerProtocol,
} from "../../UserOperations/protocols/logger";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { validateContentSize } from "../model/content";

export class CreateNews implements CreateNewsUseCaseProtocol.UseCase {
  constructor(
    private repository: NewsRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol,
    private readonly operationsLogger: UserOperationsLoggerProtocol
  ) {}

  async create(
    request: CreateNewsUseCaseProtocol.Request
  ): CreateNewsUseCaseProtocol.Response {
    const hasValidContentSizeOrError = validateContentSize(request.Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    const sendDate = new Date(request.SendDate);

    // const hasValidSendDateOrError = validateSendDate(sendDate);

    // if (hasValidSendDateOrError.isLeft()) {
    //   return left(hasValidSendDateOrError.value);
    // }

    const newsId = await this.repository.create(request);

    // E se o sistema de jobs estiver indisponível? Como o sistema deve se comportar?
    await this.queueProvider.send(
      TASK_QUEUES.NEWSLETTER,
      {
        id: newsId,
      },
      {
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: sendDate,
        singletonkey: String(newsId),
      }
    );

    await this.operationsLogger.save(request.accountId, request.description);

    const successLog = `Notícia criada com sucessso.`;

    return right(successLog);
  }
}

export namespace CreateNewsUseCaseProtocol {
  export type Request = {
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
    LocationName?: string;
  } & CommandProps;

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
