import { Either, left, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";
import { formatPaginationInput } from "../helpers/formatPaginationInput";

export class FetchCron implements FetchCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchCronUseCaseProtocol.Request
  ): Promise<Either<Error, FetchCronUseCaseProtocol.Response>> {
    const data = await this.repository.getAllSchedule({
      ...formatPaginationInput(request.pageNumber, request.limit),
      queue: request.queue,
    });

    return right(data);
  }
}

export namespace FetchCronUseCaseProtocol {
  export type Request = InputWithPagination & { queue?: string };

  export type Response = OutputWithPagination<Array<any>> | null;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<Error, FetchCronUseCaseProtocol.Response>>;
  }
}
