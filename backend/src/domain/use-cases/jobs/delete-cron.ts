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
      Queue: request.Name,
    });

    if (exists == null) {
      return left(new NotExistsError(`Queue name ${request.Name} not exists`));
    }

    const data = await this.repository.deleteSchedule({
      Name: request.Name,
    });

    return right(`Sucesso ao deletar ${request.Name}.`);
  }
}

export namespace DeleteCronUseCaseProtocol {
  export type Request = {
    Name: string;
  };
  export type Response = Promise<Either<Error, any | null>>;

  export interface UseCase {
    execute(request: Request): DeleteCronUseCaseProtocol.Response;
  }
}
