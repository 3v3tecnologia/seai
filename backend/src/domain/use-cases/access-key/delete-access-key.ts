import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { AccessKeyRepositoryProtocol } from "../_ports/repositories/acess-key.repository";
import { AlreadyExistsError } from "../errors/alreadyExistsError";

export class DeleteRegisterAccessKey
  extends Command
  implements DeleteAccessKeyUseCaseProtocol.UseCase
{
  private readonly repository: AccessKeyRepositoryProtocol;

  constructor(repository: AccessKeyRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: DeleteAccessKeyUseCaseProtocol.Request
  ): Promise<Either<AlreadyExistsError, any | null>> {
    const exists = await this.repository.getById({
      Id: request.Id,
    });

    if (exists === null) {
      return left(
        new Error(`Falha ao delete chave de acesso, chave não encontrada.`)
      );
    }

    await this.repository.delete({
      Id: request.Id,
    });

    const successMessage = `Sucesso ao deleter chave de acesso`;

    this.addLog({
      action: "DELETE",
      table: DATABASES.API_KEY,
      description: successMessage,
    });

    return right(successMessage);
  }
}

export namespace DeleteAccessKeyUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = string;

  export interface UseCase {
    execute(
      request: Request
    ): Promise<Either<AlreadyExistsError, string | null>>;
  }
}
