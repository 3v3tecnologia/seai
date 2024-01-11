import { Either, left, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { AlreadyExistsError } from "../errors/alreadyExistsError";
import { DefaultSchedulerParams } from "./utils/defaultScheduleOptions";

export class CreateCron implements CreateCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: CreateCronUseCaseProtocol.Request
  ): Promise<Either<AlreadyExistsError, any | null>> {
    const exists = await this.repository.getScheduleByQueue({
      queue: request.name,
    });

    if (exists !== null) {
      return left(
        new AlreadyExistsError(`Queue name ${request.name} already exists`)
      );
    }

    await this.repository.createSchedule({
      cron: request.cron,
      data: request.data || null,
      name: request.name,
      options: request.options || DefaultSchedulerParams.options,
      timezone: request.timezone || DefaultSchedulerParams.timezone,
    });

    return right(`Sucesso ao criar cron para a fila ${request.name}`);
  }
}

export namespace CreateCronUseCaseProtocol {
  export type Request = {
    name: any;
    cron: any;
    timezone: any;
    data: any;
    options: any;
  };

  export type Response = string;

  export interface UseCase {
    execute(
      request: CreateCronUseCaseProtocol.Request
    ): Promise<Either<AlreadyExistsError, any | null>>;
  }
}
