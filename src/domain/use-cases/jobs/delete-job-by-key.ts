import { Either, right } from "../../../shared/Either";
import { JobsRepositoryProtocol } from "../_ports/repositories/background-jobs-repository";
import { NotExistsError } from "../errors/notFound-error";

export class DeleteJobByKey implements DeleteJobByKeyUseCaseProtocol.UseCase {
    private readonly repository: JobsRepositoryProtocol;

    constructor(repository: JobsRepositoryProtocol) {
        this.repository = repository;
    }

    async execute(
        request: DeleteJobByKeyUseCaseProtocol.Request
    ): Promise<Either<NotExistsError, DeleteJobByKeyUseCaseProtocol.Response>> {
        await this.repository.deleteJobByKey(request.key);

        return right(`Sucesso ao deletar job`);
    }
}

export namespace DeleteJobByKeyUseCaseProtocol {
    export type Request = {
        key: string;
    };

    export type Response = any;

    export interface UseCase {
        execute(
            request: Request
        ): Promise<Either<NotExistsError, DeleteJobByKeyUseCaseProtocol.Response>>;
    }
}
