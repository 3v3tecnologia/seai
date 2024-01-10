import { Either, left, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { AlreadyExistsError } from "../errors/alreadyExistsError";

export class CreateCron implements CreateCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: CreateCronUseCaseProtocol.Request
  ): Promise<Either<AlreadyExistsError, any | null>> {
    const exists = await this.repository.getScheduleByQueue({
      Queue: request.Name,
    });

    if (exists !== null) {
      return left(
        new AlreadyExistsError(`Queue name ${request.Name} already exists`)
      );
    }

    await this.repository.createSchedule({
      Cron: request.Cron,
      Data: request.Data || null,
      Name: request.Name,
      Option: request.Option || null,
      Timezone: request.Timezone || null,
    });

    return right(`Sucesso ao criar cron para a fila ${request.Name}`);
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

  export interface UseCase {
    execute(
      request: CreateCronUseCaseProtocol.Request
    ): Promise<Either<AlreadyExistsError, any | null>>;
  }
}
