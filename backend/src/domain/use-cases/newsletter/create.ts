import { Either, right } from "../../../shared/Either";
import { DATABASES_NAMES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";

export class CreateNews
  extends Command
  implements CreateNewsUseCaseProtocol.UseCase
{
  private repository: NewsRepositoryProtocol;
  constructor(repository: NewsRepositoryProtocol) {
    super();
    this.repository = repository;
  }
  async create(
    request: CreateNewsUseCaseProtocol.Request
  ): CreateNewsUseCaseProtocol.Response {
    await this.repository.create(request);

    const successLog = `Notícia criada com sucessso.`;

    this.addLog({
      action: "create",
      table: DATABASES_NAMES.NEWSLETTER.NEWS,
      description: successLog,
    });

    return right(successLog);
  }
}

export namespace CreateNewsUseCaseProtocol {
  export type Request = {
    FK_Author: number;
    Title: string;
    Description: string | null;
    Data: any;
    SendDate?: string;
    LocationName?: string;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
