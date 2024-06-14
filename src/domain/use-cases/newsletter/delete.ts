import { Either, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";
import { DeleteJobByKeyUseCaseProtocol } from "../jobs";

export class DeleteNews
  extends Command
  implements DeleteNewsUseCaseProtocol.UseCase {

  private repository: NewsRepositoryProtocol;
  private readonly deleteJobByKey: DeleteJobByKeyUseCaseProtocol.UseCase;

  constructor(
    repository: NewsRepositoryProtocol,
    deleteJobByKey: DeleteJobByKeyUseCaseProtocol.UseCase
  ) {
    super();
    this.repository = repository;
    this.deleteJobByKey = deleteJobByKey;
  }
  async create(
    request: DeleteNewsUseCaseProtocol.Request
  ): DeleteNewsUseCaseProtocol.Response {
    await this.repository.delete(request);

    const successLog = `Notícia deletada com sucessso.`;

    // delete all jobs related to the news (purge by news id)
    await this.deleteJobByKey.execute({
      key: String(request.Id)
    });

    this.addLog({
      action: "delete",
      table: DATABASES.NEWSLETTER.NEWS,
      description: successLog,
    });

    return right(successLog);
  }
}

export namespace DeleteNewsUseCaseProtocol {
  export type Request = {
    Id: number;
  };

  export type Response = Promise<Either<Error, string>>;

  export interface UseCase {
    create(request: Request): Response;
  }
}
