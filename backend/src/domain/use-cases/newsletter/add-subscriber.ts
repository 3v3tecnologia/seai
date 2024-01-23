import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { SubscriberRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class SubscribeToNews
  extends Command
  implements SubscribeToNewsUseCaseProtocol.UseCase
{
  private repository: SubscriberRepositoryProtocol;

  constructor(repository: SubscriberRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async execute(
    request: SubscribeToNewsUseCaseProtocol.Request
  ): SubscribeToNewsUseCaseProtocol.Response {
    const AlreadyExistsSubscriber = await this.repository.getByEmail({
      Email: request.Email,
    });

    if (AlreadyExistsSubscriber !== null) {
      return left(new Error("Usuário já cadastrado."));
    }

    const subscriber = await this.repository.create({
      Email: request.Email,
      Name: request.Name,
    });

    let msg = `Usuário inscrito com sucesso na lista de emails`;

    this.addLog({
      action: "create",
      table: DATABASES.NEWSLETTER.SUBSCRIBER,
      description: msg,
    });

    return right(msg);
  }
}

export namespace SubscribeToNewsUseCaseProtocol {
  export type Request = {
    Email: string;
    Name: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
