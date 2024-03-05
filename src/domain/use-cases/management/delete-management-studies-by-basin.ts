import { Either, right } from "../../../shared/Either";
import { Command } from "../_ports/core/command";
import { ManagementStudiesRepositoryProtocol } from "../_ports/repositories/management-studies.repository";

export class DeleteManagementStudiesByBasin
  extends Command
  implements DeleteManagementStudiesByBasinUseCaseProtocol.UseCase
{
  private repository: ManagementStudiesRepositoryProtocol;

  constructor(repository: ManagementStudiesRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async execute(
    request: DeleteManagementStudiesByBasinUseCaseProtocol.Request
  ): DeleteManagementStudiesByBasinUseCaseProtocol.Response {
    const deleteLog = await this.repository.delete({
      Id_Basin: request.Id,
    });

    // this.addLog({
    //   action: "delete",
    //   table: DATABASES.NEWSLETTER.SUBSCRIBER,
    //   description: "Usuário deletado com sucesso da lista de emails",
    // });

    return right(deleteLog.description);
  }
}

export namespace DeleteManagementStudiesByBasinUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
