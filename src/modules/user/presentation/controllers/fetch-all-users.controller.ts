import { IPaginationInput, parsePaginationInput } from "../../../../shared/core/pagination";
import { Controller } from "../../../../shared/presentation/controllers";
import { HttpResponse, ok, serverError } from "../../../../shared/presentation/http-responses";
import { UserTypes } from "../../core/model/user";
import { IFetchUsersUseCase } from "../../use-cases";
export class FetchAllUsersController
    implements Controller<FetchAllUsersControllerProtocol.Request, HttpResponse> {
    private fetchUser: IFetchUsersUseCase;

    constructor(fetchUser: IFetchUsersUseCase) {
        this.fetchUser = fetchUser;
    }

    async handle(
        request: FetchAllUsersControllerProtocol.Request
    ): Promise<HttpResponse> {
        try {
            const dto = {
                name: request.name,
                type: request.type,
                ...parsePaginationInput({ page: request.pageNumber, limit: request.limit }),
            }

            const result = await this.fetchUser.execute(dto);

            return ok(result.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }
}

export namespace FetchAllUsersControllerProtocol {
    export type Request = {
        name?: string;
        type?: Record<UserTypes, string>;
    } & Partial<IPaginationInput>;
}
