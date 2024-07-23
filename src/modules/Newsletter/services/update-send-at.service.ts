import { Either, left, right } from "../../../shared/Either";
import { NewsRepositoryProtocol } from "../infra/database/repository/protocol/newsletter-repository";

export class UpdateSendAtNews
  implements UpdateNewsletterSendAtUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;

  constructor(repository: NewsRepositoryProtocol) {
    this.repository = repository;
  }

  async execute(
    request: UpdateNewsletterSendAtUseCaseProtocol.Request
  ): UpdateNewsletterSendAtUseCaseProtocol.Response {
    const alreadyExistsNews = await this.repository.getById({
      Id: request.Id,
    });

    if (alreadyExistsNews == null) {
      return left(new Error(`Notícia não encontrada.`));
    }

    await this.repository.updateSendAt(request.Id);

    const successLog = `Notícia atualizada com sucessso.`;

    return right(successLog);
  }
}

export namespace UpdateNewsletterSendAtUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
