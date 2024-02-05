import { Either, right } from "../../../shared/Either";
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
    await this.repository.delete({
      Id_Basin: request.Id_Basin,
    });

    this.addLog({
      action: "delete",
      table: "Pesos",
      description: "Sucesso ao apagar dados.",
    });

    const result = await this.repository.create(request);

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
    Id_Basin: number;
    Data: Array<{
      Id_Culture: number;
      Productivity: Array<number>;
      Profitability: Array<number>;
      Jobs: Array<number>;
      WaterConsumption: Array<number>;
    }>;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
