import { Either, right } from "../../../shared/Either";
import { ManagementCensusStudy } from "../../entities/management/study";
import { Command } from "../_ports/core/command";
import { ManagementStudiesRepositoryProtocol } from "../_ports/repositories/management-studies.repository";

export class InsertManagementStudiesByBasin
  extends Command
  implements InsertManagementStudiesByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementStudiesRepositoryProtocol;

  constructor(repository: ManagementStudiesRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: InsertManagementStudiesByBasinUseCaseProtocol.Request
  ): InsertManagementStudiesByBasinUseCaseProtocol.Response {
    await this.repository.delete({
      Id_Bacia: request.Id_Bacia,
    });

    this.addLog({
      action: "delete",
      table: "Estudos",
      description: "Sucesso ao apagar dados dados.",
    });

    const result = await this.repository.create({
      Id_Bacia: request.Id_Bacia,
      Data: request.Data,
    });

    this.addLog({
      action: "create",
      table: "Estudos",
      description: "Sucesso ao inserir dados.",
    });

    return right("Sucesso ao inserir dados.");
  }
}

export namespace InsertManagementStudiesByBasinUseCaseProtocol {
  export type Request = {
    Id_Bacia: number;
    Data: Array<{
      Id_Cultura: number;
      Safra: number;
      Cultivo: number;
      Produtividade: Array<number>;
    }>;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
