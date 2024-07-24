import { CreateJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/logger/logger";
import { isDateInThePast } from "../../../shared/utils/date";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";
import { validateContentSize, validateSendDate } from "../model/content";

export class CreateNews implements CreateNewsUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  private readonly createJobQueue: CreateJobUseCaseProtocol.UseCase;
  constructor(
    repository: NewsRepositoryProtocol,
    createJobQueue: CreateJobUseCaseProtocol.UseCase
  ) {
    this.repository = repository;
    this.createJobQueue = createJobQueue;
  }

  private async createJob(
    newsId: number,
    sendDate: Date
  ): Promise<Either<Error, string>> {
    try {
      const jobOrError = await this.createJobQueue.execute({
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

      if (jobOrError.isLeft()) {
        return left(jobOrError.value);
      }

      const job = jobOrError.value;

      return right("Sucesso ao agentar job de notícias");
    } catch (error) {
      console.error(error);
      return left(new Error("Falha ao agendar job de notícias"));
    }
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

    const scheduleJobOrError = await this.createJob(newsId, sendDate);

    // E se o sistema de jobs estiver indisponível? Como o sistema deve se comportar?
    if (scheduleJobOrError.isLeft()) {
      Logger.error(scheduleJobOrError.value.message);
    } else {
      Logger.info(scheduleJobOrError.value as string);
    }

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
