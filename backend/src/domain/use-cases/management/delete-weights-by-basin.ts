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
    const result = await this.repository.delete({
      Id_Bacia: request.Id,
    });

    // this.addLog({
    //   action: "delete",
    //   table: DATABASES.NEWSLETTER.SUBSCRIBER,
    //   description: "Usuário deletado com sucesso da lista de emails",
    // });

    return right("Dados apagados com sucesso");
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
