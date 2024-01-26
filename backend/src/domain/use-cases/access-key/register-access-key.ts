import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { AccessKeyRepositoryProtocol } from "../_ports/repositories/acess-key.repository";
import { AlreadyExistsError } from "../errors/alreadyExistsError";

export class RegisterAccessKey
  extends Command
  implements RegisterAccessKeyUseCaseProtocol.UseCase
{
  private readonly repository: AccessKeyRepositoryProtocol;

  constructor(repository: AccessKeyRepositoryProtocol) {
    super();
    this.repository = repository;
  }

  async execute(
    request: RegisterAccessKeyUseCaseProtocol.Request
  ): Promise<Either<AlreadyExistsError, any | null>> {
    const accessId = await this.repository.create({
      Key: request.Key,
      Enabled: request.Enabled,
      Type: request.Type,
    });

    console.log(`Token de acesso criado ${accessId}`);

    const successMessage = `Sucesso ao criar chave de acesso.`;

    this.addLog({
      action: "CREATE",
      table: DATABASES.API_KEY,
      description: successMessage,
    });

    return right(accessId);
  }
}

export namespace RegisterAccessKeyUseCaseProtocol {
  export type Request = {
    Key: string;
    Type: string;
    Enabled: any;
  };

  export type Response = string;

  export interface UseCase {
    execute(request: Request): Promise<Either<AlreadyExistsError, any | null>>;
  }
}
