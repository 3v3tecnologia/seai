import { Either, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { InputWithPagination, OutputWithPagination } from "../helpers/dto";

export class FetchCron implements FetchCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: FetchCronUseCaseProtocol.Request
  ): Promise<Either<Error, FetchCronUseCaseProtocol.Response>> {
    const data = await this.repository.getAllSchedule({
      limit: request.limit,
      pageNumber: request.pageNumber,
      queue: request.Queue,
    });

    return right(data);
  }
}

export namespace FetchCronUseCaseProtocol {
  export type Request = InputWithPagination & { Queue?: string };

  export type Response = OutputWithPagination<Array<any>> | null;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<Error, FetchCronUseCaseProtocol.Response>>;
  }
}
