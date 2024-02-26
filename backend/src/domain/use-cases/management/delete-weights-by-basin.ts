import { Either, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";
import { ManagementWeightsRepositoryProtocol } from "../_ports/repositories/management-weights.repository";

export class DeleteManagementWeightsByBasin
  extends Command
  implements DeleteManagementWeightsByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementWeightsRepositoryProtocol;

  constructor(repository: ManagementWeightsRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: DeleteManagementWeightsByBasinUseCaseProtocol.Request
  ): DeleteManagementWeightsByBasinUseCaseProtocol.Response {
    const deleteLog = await this.repository.delete({
      Id_Basin: request.Id,
    });

    this.addLog(deleteLog);

    return right(deleteLog.description);
  }
}

export namespace DeleteManagementWeightsByBasinUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
