import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { CreateJobUseCaseProtocol } from "../jobs";

export class CreateNews
  extends Command
  implements CreateNewsUseCaseProtocol.UseCase {
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

  private async createJob(newsId: number, sendDate?: string) {
    try {
      const jobOrError = await this.scheduleJob.execute({
        name: "send-newsletter",
        data: {
          id: newsId,
        },
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: sendDate,
      });



      if (jobOrError.isLeft()) {
        return left(jobOrError.value);
      }

      const job = jobOrError.value;


      await this.repository.associateJobToNews(job.id, newsId);

      return right("Sucesso ao agentar job de notícias")
    } catch (error) {
      console.error(error)
      return left(new Error("Falha ao agendar job de notícias"))
    }
  }

  async create(
    request: CreateNewsUseCaseProtocol.Request
  ): CreateNewsUseCaseProtocol.Response {
    const newsId = await this.repository.create(request);

    const scheduleJobOrError = await this.createJob(newsId, request.SendDate)

    if (scheduleJobOrError.isLeft()) {
      console.error(scheduleJobOrError.value)
    } else {
      console.log(scheduleJobOrError.value);
    }

    const successLog = `Notícia criada com sucessso.`;

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
