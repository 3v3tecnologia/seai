import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { CreateJobUseCaseProtocol } from "../jobs";

export class CreateNews
  extends Command
  implements CreateNewsUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;
  private readonly scheduleJob: CreateJobUseCaseProtocol.UseCase;
  constructor(
    repository: NewsRepositoryProtocol,
    scheduleJob: CreateJobUseCaseProtocol.UseCase
  ) {
    super();
    this.repository = repository;
    this.scheduleJob = scheduleJob;
  }
  async create(
    request: CreateNewsUseCaseProtocol.Request
  ): CreateNewsUseCaseProtocol.Response {
    const newsId = await this.repository.create(request);

    const jobOrError = await this.scheduleJob.execute({
      name: "send-newsletter",
      data: {
        id: newsId,
      },
      priority: 1,
      retryDelay: 60,
      retryLimit: 3,
      startAfter: request.SendDate,
    });

    const successLog = `Notícia criada com sucessso.`;

    if (jobOrError.isLeft()) {
      return left(jobOrError.value);
    }

    this.addLog({
      action: "create",
      table: DATABASES.NEWSLETTER.NEWS,
      description: successLog,
    });

    return right(successLog);
  }
}

export namespace CreateNewsUseCaseProtocol {
  export type Request = {
    FK_Author: number;
    Title: string;
    Description: string | null;
    Data: any;
    SendDate?: string;
    LocationName?: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
