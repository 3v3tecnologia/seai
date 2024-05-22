import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/external/db/tableNames";
import { Command } from "../../../shared/core/command";
import { SubscriberRepositoryProtocol } from "../../../domain/use-cases/_ports/repositories/newsletter-repository";

export class DeleteNewsletterSubscriber
  extends Command
  implements DeleteNewsletterSubscriberUseCaseProtocol.UseCase {
  private repository: SubscriberRepositoryProtocol;

  constructor(repository: SubscriberRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async execute(
    request: DeleteNewsletterSubscriberUseCaseProtocol.Request
  ): DeleteNewsletterSubscriberUseCaseProtocol.Response {
    const subscriber = await this.repository.getByEmail({
      Email: request.Email,
    });

    if (subscriber === null) {
      return left(new Error("Email não encontrado"));
    }

    this.addLog({
      action: "delete",
      table: DATABASES.NEWSLETTER.SUBSCRIBER,
      description: "Usuário deletado com sucesso da lista de emails",
    });

    return right("Usuário deletado com sucesso da lista de emails");
  }
}

export namespace DeleteNewsletterSubscriberUseCaseProtocol {
  export type Request = {
    Email: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
