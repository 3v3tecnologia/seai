import { Either, left, right } from "../../../shared/Either";
import { TASK_QUEUES } from "../../../shared/infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../shared/infra/queueProvider/protocol/jog-scheduler.protocol";
import { UserCommandOperationProps } from "../../Logs/protocols/logger";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { validateContentSize } from "../model/content";

export class UpdateNews implements UpdateNewsUseCaseProtocol {
  constructor(
    private readonly repository: NewsRepositoryProtocol,
    private readonly queueProvider: TaskSchedulerProviderProtocol
  ) {
    this.repository = repository;
    this.queueProvider = queueProvider;
  }

  async execute(
    news: {
      Id: number;
      Title: string;
      Description: string | null;
      Data: any;
      LocationName?: string;
      SendDate: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>> {
    const hasValidContentSizeOrError = validateContentSize(news.Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    const sendDate = new Date(news.SendDate);

    // const hasValidSendDateOrError = validateSendDate(sendDate);

    // if (hasValidSendDateOrError.isLeft()) {
    //   return left(hasValidSendDateOrError.value);
    // }

    const alreadyExistsNews = await this.repository.getById(news.Id);

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    if (alreadyExistsNews.SentAt) {
      return left(
        new Error(`Notícia é possível editar uma notícia já enviada.`)
      );
    }

    await this.repository.update(news, operation);

    const successLog = `Notícia atualizada com sucessso.`;

    await this.queueProvider.removeByKey(String(news.Id));

    await this.queueProvider.send(
      TASK_QUEUES.NEWSLETTER,
      {
        id: news.Id,
        title: news.Title,
        description: news.Description,
        content: news.Data,
      },
      {
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: new Date(news.SendDate),
        singletonkey: String(news.Id),
      }
    );

    return right(successLog);
  }
}

export interface UpdateNewsUseCaseProtocol {
  execute(
    news: {
      Id: number;
      Title: string;
      Description: string | null;
      Data: any;
      LocationName?: string;
      SendDate: string;
    },
    operation: UserCommandOperationProps
  ): Promise<Either<Error, string>>;
}
