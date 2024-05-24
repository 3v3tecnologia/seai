import { Either, left, right } from "../../../shared/Either";
import { DATABASES } from "../../../shared/db/tableNames";
import { Command } from "../_ports/core/command";
import { NewsRepositoryProtocol } from "../_ports/repositories/newsletter-repository";


export class UpdateSendAtNews
    extends Command
    implements UpdateNewsletterSendAtUseCaseProtocol.UseCase {
    private repository: NewsRepositoryProtocol;

    constructor(
        repository: NewsRepositoryProtocol
    ) {
        super();
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

        this.addLog({
            action: "update",
            table: DATABASES.NEWSLETTER.NEWS,
            description: successLog,
        });


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
