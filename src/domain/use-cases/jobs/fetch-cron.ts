import { Either, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { IPaginationInput, OldOutputWithPagination } from "../helpers/pagination";

export class FetchCron implements FetchCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchCronUseCaseProtocol.Request
  ): Promise<Either<Error, FetchCronUseCaseProtocol.Response>> {
    const data = await this.repository.getAllSchedule(request);

    return right(data);
  }
}

export namespace FetchCronUseCaseProtocol {
  export type Request = IPaginationInput & { queue?: string };

  export type Response = OldOutputWithPagination<any> | null;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<Error, Response>>;
  }
}
