import { QueueProviderProtocol } from "../../../infra/queueProvider/queue.provider";
import { Either, left, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { validateContentSize } from "../model/content";

export class CreateNews implements CreateNewsUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  private readonly queueProvider: QueueProviderProtocol;

  constructor(
    repository: NewsRepositoryProtocol,
    queueProvider: QueueProviderProtocol
  ) {
    this.repository = repository;
    this.queueProvider = queueProvider;
  }


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
    await this.queueProvider.queue({
        name: "send-newsletter",
        data: {
          id: newsId,
        },
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: sendDate,
        singletonkey: String(newsId),
      });

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
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
