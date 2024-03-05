import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

export class FetchJobs implements FetchJobUseCaseProtocol.UseCase {
  private readonly repository: JobsRepositoryProtocol;

  constructor(repository: JobsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchJobUseCaseProtocol.Request
  ): Promise<Either<Error, any | null>> {
    if (request.id) {
      const job = await this.repository.getJobById(request.id);

      if (job == null) {
        return left(
          new Error(`Não foi possível encontrar job com id ${request.id}`)
        );
      }

      return right(job);
    }

    const dto = {
      limit: request.limit || 50,
      pageNumber: request.pageNumber || 1,
    };

    if (request.queue)
      Object.assign(dto, {
        queue: request.queue,
      });

    if (request.state)
      Object.assign(dto, {
        queue: request.state,
      });

    const data = await this.repository.getJobs(dto);

    return right(data);
  }
}

export namespace FetchJobUseCaseProtocol {
  export type Request = {
    id?: string;
  } & Partial<InputWithPagination> & { queue?: string; state?: string };

  export type Response = OutputWithPagination<any[]> | null | any;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
