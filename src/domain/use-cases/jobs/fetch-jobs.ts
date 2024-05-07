import { Either, left, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { IPaginationInput, IOutputWithPagination, OldOutputWithPagination } from "../helpers/pagination";

import { JobsRepositoryDTO } from '../_ports/repositories/background-jobs-repository'
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


    const data = await this.repository.getJobs(request as JobsRepositoryDTO.Fetch.Request);

    return right(data);
  }
}

export namespace FetchJobUseCaseProtocol {
  export type Request = {
    id?: string;
  } & Partial<IPaginationInput> & { queue?: string; state?: string };

  export type Response = OldOutputWithPagination<any[]> | null | any;

  export interface UseCase {
    execute(request: Request): Promise<Either<Error, any | null>>;
  }
}
