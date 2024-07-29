import { TASK_QUEUES } from "../../../infra/queueProvider/helpers/queues";
import { TaskSchedulerProviderProtocol } from "../../../infra/queueProvider/protocol/jog-scheduler.protocol";
import { Either, left, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { validateContentSize } from "../model/content";

export class UpdateNews implements UpdateNewsUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  private readonly queueProvider: TaskSchedulerProviderProtocol;

  constructor(
    repository: NewsRepositoryProtocol,
    queueProvider: TaskSchedulerProviderProtocol
  ) {
    this.repository = repository;
    this.queueProvider = queueProvider;
  }

  async execute(
    request: UpdateNewsUseCaseProtocol.Request
  ): UpdateNewsUseCaseProtocol.Response {
    const hasValidContentSizeOrError = validateContentSize(request.Data);

    if (hasValidContentSizeOrError.isLeft()) {
      return left(hasValidContentSizeOrError.value);
    }

    const sendDate = new Date(request.SendDate);

    // const hasValidSendDateOrError = validateSendDate(sendDate);

    // if (hasValidSendDateOrError.isLeft()) {
    //   return left(hasValidSendDateOrError.value);
    // }

    const alreadyExistsNews = await this.repository.getById({
      Id: request.Id,
    });

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    if (alreadyExistsNews.SentAt) {
      return left(
        new Error(`Notícia é possível editar uma notícia já enviada.`)
      );
    }

    await this.repository.update(request);

    const successLog = `Notícia atualizada com sucessso.`;

    await this.queueProvider.removeByKey(String(request.Id));

    await this.queueProvider.send(
      TASK_QUEUES.NEWSLETTER,
      {
        id: request.Id,
      },
      {
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: new Date(request.SendDate),
        singletonkey: String(request.Id),
      }
    );

    return right(successLog);
  }
}

export namespace UpdateNewsUseCaseProtocol {
  export type Request = {
    Id: number;
    Title: string;
    Description: string | null;
    Data: any;
    LocationName?: string;
    SendDate: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
