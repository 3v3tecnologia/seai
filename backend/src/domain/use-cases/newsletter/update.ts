import { Either, right } from "../../../shared/Either";
import { DATABASES_NAMES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class UpdateNews
  extends Command
  implements UpdateNewsUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async create(
    request: UpdateNewsUseCaseProtocol.Request
  ): UpdateNewsUseCaseProtocol.Response {
    await this.repository.update(request);

    const successLog = `Notícia atualizada com sucessso.`;

    this.addLog({
      action: "update",
      table: DATABASES_NAMES.NEWSLETTER.NEWS,
      description: successLog,
    });

    return right(successLog);
  }
}

export namespace UpdateNewsUseCaseProtocol {
  export type Request = {
    Id: number;
    Title: string;
    FK_Author: string;
    Description: string | null;
    Data: any;
    LocationName?: string;
    SendDate?: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
