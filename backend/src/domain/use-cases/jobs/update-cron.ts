import { Either, left, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NotExistsError } from "../errors/notFound-error";

export class UpdateCron implements UpdateCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: UpdateCronUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateCronUseCaseProtocol.Response>> {
    const exists = await this.repository.getScheduleByQueue({
      Queue: request.Name,
    });

    if (exists == null) {
      return left(new NotExistsError(`Queue name ${request.Name} not exists`));
    }

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

  export interface UseCase {
    execute(
      request: UpdateCronUseCaseProtocol.Request
    ): Promise<Either<Error, UpdateCronUseCaseProtocol.Response>>;
  }
}
