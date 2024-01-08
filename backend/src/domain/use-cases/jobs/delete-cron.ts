import { request } from "http";
import { Either, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class DeleteCron {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: DeleteCronUseCaseProtocol.Request
  ): DeleteCronUseCaseProtocol.Response {
    const data = await this.repository.deleteSchedule({
      Name: request.Name,
    });

    return right(data);
  }
}

export namespace DeleteCronUseCaseProtocol {
  export type Request = {
    Name: string;
  };
  export type Response = Promise<Either<Error, any | null>>;
}
