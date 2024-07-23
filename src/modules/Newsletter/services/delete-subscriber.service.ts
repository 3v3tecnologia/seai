import { Either, left, right } from "../../../shared/Either";
import { NewsletterSubscriberRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";

export class DeleteNewsletterSubscriber
  implements DeleteNewsletterSubscriberUseCaseProtocol.UseCase
{
  private repository: NewsletterSubscriberRepositoryProtocol;

  constructor(repository: NewsletterSubscriberRepositoryProtocol) {
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

    await this.repository.delete({
      Email: request.Email,
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
