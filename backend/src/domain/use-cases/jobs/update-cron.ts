import { Either, left, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NotExistsError } from "../errors/notFound-error";
import { DefaultSchedulerParams } from "./utils/defaultScheduleOptions";

export class UpdateCron implements UpdateCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: UpdateCronUseCaseProtocol.Request
  ): Promise<Either<Error, UpdateCronUseCaseProtocol.Response>> {
    const exists = await this.repository.getScheduleByQueue({
      queue: request.name,
    });

    if (exists == null) {
      return left(new NotExistsError(`Queue name ${request.name} not exists`));
    }

    await this.repository.updateSchedule({
      cron: request.cron,
      data: request.data,
      name: request.name,
      options: request.options || DefaultSchedulerParams.options,
      timezone: request.timezone || DefaultSchedulerParams.timezone,
    });

    return right(`Sucesso ao atualizar cron.`);
  }
}

export namespace UpdateCronUseCaseProtocol {
  export type Request = {
    name: any;
    cron: any;
    timezone: any;
    data: any;
    options: any;
  };

  export type Response = any | null;

  export interface UseCase {
    execute(
      request: UpdateCronUseCaseProtocol.Request
    ): Promise<Either<Error, UpdateCronUseCaseProtocol.Response>>;
  }
}
