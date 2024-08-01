import { TASK_QUEUES } from "../../../infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, left, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { validateContentSize } from "../model/content";

export class CreateNews implements CreateNewsUseCaseProtocol {
  constructor(
    private repository: NewsRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol
  ) {}

  async execute({
    Data,
    Description,
    SendDate,
    Title,
    accountId,
    LocationName,
  }: {
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
    LocationName?: string;
    accountId: number;
  }): Promise<Either<Error, number>> {
    const hasValidContentSizeOrError = validateContentSize(Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    const sendDate = new Date(SendDate);

    // const hasValidSendDateOrError = validateSendDate(sendDate);

    // if (hasValidSendDateOrError.isLeft()) {
    //   return left(hasValidSendDateOrError.value);
    // }

    const newsId = await this.repository.create(
      {
        Data,
        Description,
        SendDate,
        Title,
        LocationName,
      },
      accountId
    );

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

    return right(newsId);
  }
}

export interface CreateNewsUseCaseProtocol {
  execute(request: {
    Title: string;
    Description: string | null;
    Data: any;
    SendDate: string;
    LocationName?: string;
    accountId: number;
  }): Promise<Either<Error, number>>;
}
