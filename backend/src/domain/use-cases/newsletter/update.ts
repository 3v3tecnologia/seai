import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import {
  CreateJobUseCaseProtocol,
  FetchJobUseCaseProtocol,
  UpdateJobUseCaseProtocol,
} from "../jobs";

export class UpdateNews
  extends Command
  implements UpdateNewsUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;
  private scheduleJob: CreateJobUseCaseProtocol.UseCase;
  private fetchJob: FetchJobUseCaseProtocol.UseCase;
  private updateJob: UpdateJobUseCaseProtocol.UseCase;

  constructor(
    repository: NewsRepositoryProtocol,
    scheduleJob: CreateJobUseCaseProtocol.UseCase,
    fetchJob: FetchJobUseCaseProtocol.UseCase,
    updateJob: UpdateJobUseCaseProtocol.UseCase
  ) {
    super();
    this.repository = repository;
    this.scheduleJob = scheduleJob;
    this.fetchJob = fetchJob;
    this.updateJob = updateJob;
  }
  async create(
    request: UpdateNewsUseCaseProtocol.Request
  ): UpdateNewsUseCaseProtocol.Response {
    const alreadyExistsNews = await this.repository.getById({
      Id: request.Id,
    });

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    if (alreadyExistsNews.SendDate !== request.SendDate) {
      const associatedJobId = await this.repository.getIdJobFromNews(
        request.Id
      );

      if (associatedJobId) {
        const jobOrError = await this.fetchJob.execute({
          id: associatedJobId,
          limit: 1,
          pageNumber: 1,
        });

        if (jobOrError.isRight()) {
          console.log("Atualizando job");
          const jobData = jobOrError.value;

          await this.updateJob.execute({
            id: jobData.Id,
            data: request.Data,
            name: jobData.Name,
            priority: jobData.Priority,
            retryDelay: jobData.RetryDelay,
            retryLimit: jobData.RetryLimit,
            startAfter: request.SendDate,
            state: "created",
          });
        } else {
          const jobOrError = await this.scheduleJob.execute({
            name: "send-newsletter",
            data: {
              id: request.Id,
            },
            priority: 1,
            retryDelay: 60,
            retryLimit: 3,
            startAfter: request.SendDate,
          });

          if (jobOrError.isLeft()) {
            console.log("Falha ao agendar job de notícia ", request.Id);
          }
        }
      } else {
        const jobOrError = await this.scheduleJob.execute({
          name: "send-newsletter",
          data: {
            id: request.Id,
          },
          priority: 1,
          retryDelay: 60,
          retryLimit: 3,
          startAfter: request.SendDate,
        });

        if (jobOrError.isLeft()) {
          console.log("Falha ao agendar job de notícia ", request.Id);
        }
      }
    }

    await this.repository.update(request);

    const successLog = `Notícia atualizada com sucessso.`;

    this.addLog({
      action: "update",
      table: DATABASES.NEWSLETTER.NEWS,
      description: successLog,
    });

    return right(successLog);
  }
}

export namespace UpdateNewsUseCaseProtocol {
  export type Request = {
    Id: number;
    Title: string;
    FK_Author: string;
    Description: string | null;
    Data: any;
    LocationName?: string;
    SendDate?: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
