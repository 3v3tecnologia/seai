import { NewsRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";
import { CreateJobUseCaseProtocol } from "../../../domain/use-cases/jobs";
import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/logger/logger";

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
        startAfter: sendDate.toISOString(),
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
    const sendDate = new Date(request.SendDate);

    // if (isDateInThePast(sendDate)) {
    //   return left(new Error("Não é possível cadastrar uma notícia com data de envio no pasado"))
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
    FK_Author: number;
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
