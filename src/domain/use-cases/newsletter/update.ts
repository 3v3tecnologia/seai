import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import {
  CreateJobUseCaseProtocol,
  DeleteJobByKeyUseCaseProtocol
} from "../jobs";

export class UpdateNews
  extends Command
  implements UpdateNewsUseCaseProtocol.UseCase {
  private repository: NewsRepositoryProtocol;
  private createJob: CreateJobUseCaseProtocol.UseCase;
  private readonly deleteJobByKey: DeleteJobByKeyUseCaseProtocol.UseCase;

  constructor(
    repository: NewsRepositoryProtocol,
    createJob: CreateJobUseCaseProtocol.UseCase,
    deleteJobByKey: DeleteJobByKeyUseCaseProtocol.UseCase,
  ) {
    super();
    this.repository = repository;
    this.createJob = createJob;
    this.deleteJobByKey = deleteJobByKey;
  }


  private async createNewsletterJob(
    request: UpdateNewsUseCaseProtocol.Request
  ) {
    try {
      // delete all jobs related to the news
      await this.deleteJobByKey.execute({
        key: String(request.Id)
      })

      const jobOrError = await this.createJob.execute({
        name: "send-newsletter",
        data: {
          id: request.Id,
        },
        priority: 1,
        retryDelay: 60,
        retryLimit: 3,
        startAfter: request.SendDate,
        singletonkey: String(request.Id)
      });

      if (jobOrError.isLeft()) {
        return left(jobOrError.value);
      }

      const job = jobOrError.value;


      return right("Job de notícia agendado com sucesso!");

    } catch (error) {
      console.error(error);
      return left(new Error("Falha ao criar job de notícias"))
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

    if (alreadyExistsNews.SentAt) {
      return left(new Error(`Notícia é possível editar uma notícia já enviada.`));
    }

    await this.repository.update(request);

    const successLog = `Notícia atualizada com sucessso.`;

    this.addLog({
      action: "update",
      table: DATABASES.NEWSLETTER.NEWS,
      description: successLog,
    });

    const scheduleJobOrError = await this.createNewsletterJob(request);

    if (scheduleJobOrError.isLeft()) {
      console.error("Falha ao reagendar ou criar jobs");
      console.error(scheduleJobOrError.value);
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
