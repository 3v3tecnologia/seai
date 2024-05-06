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
  implements UpdateNewsUseCaseProtocol.UseCase {
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

  private async createNewsletterJob(
    request: UpdateNewsUseCaseProtocol.Request
  ) {
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
      return left(jobOrError.value);
    }

    const job = jobOrError.value;

    await this.repository.associateJobToNews(job.id, request.Id);

    return right("Job de notícia agendado com sucesso!");
  }

  private async updateNewsletterJob(
    oldJob: {
      id: string;
      name: string;
      priority: number;
      retryDelay: number;
      retryLimit: number;
    },
    toUpdate: {
      NewsId: number;
      SendDate?: string;
    }
  ) {
    console.log("Atualizando job", oldJob);

    return await this.updateJob.execute({
      id: oldJob.id,
      data: toUpdate.NewsId
        ? {
          id: toUpdate.NewsId,
        }
        : null,
      name: oldJob.name,
      priority: oldJob.priority,
      retryDelay: oldJob.retryDelay,
      retryLimit: oldJob.retryLimit,
      startAfter: toUpdate.SendDate,
      state: "created",
    });
  }

  private async createOrScheduleJob(
    request: UpdateNewsUseCaseProtocol.Request
  ) {
    try {
      const associatedJobId = await this.repository.getIdJobFromNews(request.Id);
      if (associatedJobId === null) {
        return await this.createNewsletterJob(request);
      }

      const jobOrError = await this.fetchJob.execute({
        id: associatedJobId,
      });

      if (jobOrError.isLeft()) {
        return await this.createNewsletterJob(request);
      }

      const oldJob = jobOrError.value;


      const currentDate = new Date().getTime();

      const newSendDate = new Date(request.SendDate).getTime();

      const isSendDateToFuture = currentDate - newSendDate < 0;

      return await this.updateNewsletterJob(oldJob, {
        NewsId: request.Id,
        SendDate: isSendDateToFuture ? request.SendDate : oldJob.startafter,
      });
    } catch (error) {
      console.error(error);
      return left(new Error("Falha ao criar ou reagendar job de notícias"))
    }
  }

  async execute(
    request: UpdateNewsUseCaseProtocol.Request
  ): UpdateNewsUseCaseProtocol.Response {
    const alreadyExistsNews = await this.repository.getById({
      Id: request.Id,
    });

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    await this.repository.update(request);

    const successLog = `Notícia atualizada com sucessso.`;

    this.addLog({
      action: "update",
      table: DATABASES.NEWSLETTER.NEWS,
      description: successLog,
    });

    const updatedOrError = await this.createOrScheduleJob(request);

    if (updatedOrError.isLeft()) {
      console.error("Falha ao reagendar ou criar jobs");
      console.error(updatedOrError.value);
    }

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
    SendDate: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
