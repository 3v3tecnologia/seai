import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { AccessKeyRepositoryProtocol } from "../_ports/repositories/acess-key.repository";
import { AlreadyExistsError } from "../errors/alreadyExistsError";

export class UpdateRegisterAccessKey
  extends Command
  implements UpdateAccessKeyUseCaseProtocol.UseCase
{
  private readonly repository: AccessKeyRepositoryProtocol;

  constructor(repository: AccessKeyRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: UpdateAccessKeyUseCaseProtocol.Request
  ): Promise<Either<AlreadyExistsError, any | null>> {
    const exists = await this.repository.getById({
      Id: request.Id,
    });

    if (exists === null) {
      return left(
        new Error(`Falha ao atualizar chave de acesso, chave não encontrada.`)
      );
    }

    await this.repository.update({
      Id: request.Id,
      Key: request.Key,
      Type: request.Type,
      Enabled: request.Enabled,
    });

    this.addLog({
      action: "UPDATE",
      table: DATABASES.API_KEY,
      description: `Sucesso ao atualizar chave de acesso ${request.Id}`,
    });

    return right(`Sucesso ao atualizar chave de acesso`);
  }
}

export namespace UpdateAccessKeyUseCaseProtocol {
  export type Request = {
    Id: number;
    Key: string;
    Type: string;
    Enabled: any;
  };

  export type Response = string;

  export interface UseCase {
    execute(request: Request): Promise<Either<AlreadyExistsError, any | null>>;
  }
}
