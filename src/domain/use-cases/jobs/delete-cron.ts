import { Either, left, right } from "../../../shared/Either";
import { ScheduleRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NotExistsError } from "../errors/notFound-error";

export class DeleteCron implements DeleteCronUseCaseProtocol.UseCase {
  private readonly repository: ScheduleRepositoryProtocol;

  constructor(repository: ScheduleRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: DeleteCronUseCaseProtocol.Request
  ): DeleteCronUseCaseProtocol.Response {
    const exists = await this.repository.getScheduleByQueue({
      queue: request.name,
    });

    if (exists == null) {
      return left(new NotExistsError(`Queue name ${request.name} not exists`));
    }

    await this.repository.deleteSchedule({
      name: request.name,
    });

    return right(`Sucesso ao deletar ${request.name}.`);
  }
}

export namespace DeleteCronUseCaseProtocol {
  export type Request = {
    name: string;
  };
  export type Response = Promise<Either<Error, any | null>>;

  export interface UseCase {
    execute(request: Request): DeleteCronUseCaseProtocol.Response;
  }
}
