import { Either, right } from "../../../shared/Either";
import { ManagementCensusStudy } from "../../entities/management/study";
import { ManagementWeight } from "../../entities/management/weights";
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
    if (Reflect.has(request, "Id") && request.Id) {
      this.addLog({
        action: "delete",
        table: "Pesos",
        description: "Sucesso ao apagar dados dados.",
      });
      await this.repository.delete({
        Id_Bacia: request.Id,
      });
    }

    const result = await this.repository.create(request.Data);

    this.addLog({
      action: "create",
      table: "Pesos",
      description: "Sucesso ao inserir dados.",
    });

    return right("Sucesso ao inserir dados.");
  }
}

export namespace InsertManagementWeightsByBasinUseCaseProtocol {
  export type Request = {
    Id?: number;
    Data: Array<ManagementWeight>;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
