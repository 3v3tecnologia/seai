import { Either, left, right } from "../../../shared/Either";
import { Content } from "../../entities/newsletter/news";
import { Command } from "../_ports/core/command";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class FetchByIdNews
  extends Command
  implements FetchNewsByIdUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;
  private jobsRepository: JobsRepositoryProtocol;
  constructor(
    repository: NewsRepositoryProtocol,
    jobsRepository: JobsRepositoryProtocol
  ) {
    super();
    this.repository = repository;
    this.jobsRepository = jobsRepository;
  }
  async execute(
    request: FetchNewsByIdUseCaseProtocol.Request
  ): FetchNewsByIdUseCaseProtocol.Response {
    const data = await this.repository.getById(request);

    if (data === null) {
      return right(null);
    }

    const jobId = await this.repository.getIdJobFromNews(request.Id);

    if (jobId !== null) {
      const job = await this.jobsRepository.getJobById(jobId);

      if (job) {
        data!.SendDate = job.startafter;
      }
    }

    return right(data);
  }
}

export namespace FetchNewsByIdUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, Content | null>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
