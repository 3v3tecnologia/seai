import { Either, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";

export class CreateCron {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(request: any): Promise<Either<Error, any | null>> {
    const data = await this.repository.createSchedule({
      Cron: request.cron,
      Data: request.data,
      Name: request.Name,
      Option: request.options,
      Timezone: request.timezone,
    });
    return right(data);
  }
}

export namespace CreateCronUseCaseProtocol {
  export type Request = {
    Name: any;
    Cron: any;
    Timezone: any;
    Data: any;
    Option: any;
  };

  export type Response = string;
}
