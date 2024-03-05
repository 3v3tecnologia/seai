import { Either, right } from "../../../shared/Either";
import { CultureWeights } from "../../entities/management/weights";
import { Command } from "../_ports/core/command";
import { ManagementWeightsRepositoryProtocol } from "../_ports/repositories/management-weights.repository";

export class InsertManagementWeightsByBasin
  extends Command
  implements InsertManagementWeightsByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementWeightsRepositoryProtocol;

  constructor(repository: ManagementWeightsRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: InsertManagementWeightsByBasinUseCaseProtocol.Request
  ): InsertManagementWeightsByBasinUseCaseProtocol.Response {
    const deleteLog = await this.repository.delete({
      Id_Basin: request.Id_Basin,
    });

    this.addLog(deleteLog);

    const successLog = await this.repository.create(request.Weights);

    this.addLog(successLog);

    return right(successLog.description);
  }
}

export namespace InsertManagementWeightsByBasinUseCaseProtocol {
  export type Request = {
    Id_Basin: number;
    Weights: Array<CultureWeights>;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
