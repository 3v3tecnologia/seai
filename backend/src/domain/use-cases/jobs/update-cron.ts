import { Either, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class UpdateCron {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: UpdateCronUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateCronUseCaseProtocol.Response>> {
    const data = await this.repository.updateSchedule({
      Cron: request.Cron,
      Data: request.Data,
      Name: request.Name,
      Option: request.Option,
      Timezone: request.Timezone,
    });
    return right(data);
  }
}

export namespace UpdateCronUseCaseProtocol {
  export type Request = {
    Name: any;
    Cron: any;
    Timezone: any;
    Data: any;
    Option: any;
  };

  export type Response = any | null;
}
