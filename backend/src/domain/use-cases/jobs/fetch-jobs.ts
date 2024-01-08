import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

export class FetchJobs {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchJobUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    if (request.Id) {
      const job = await this.repository.getJobById(request.Id);

      if (job == null) {
        return left(
          new Error(`Não foi possível encontrar job com id ${request.Id}`)
        );
      }
      return right(job);
    }

    const dto = {
      limit: request.limit || 50,
      pageNumber: request.pageNumber || 1,
    };

    if (request.Queue)
      Object.assign(dto, {
        queue: request.Queue,
      });

    if (request.State)
      Object.assign(dto, {
        queue: request.State,
      });

    const data = await this.repository.getJobs(dto);

    return right(data);
  }
}

export namespace FetchJobUseCaseProtocol {
  export type Request = {
    Id?: string;
  } & InputWithPagination & { Queue?: string; State?: string };

  export type Response = OutputWithPagination<any[]> | null | any;
}
