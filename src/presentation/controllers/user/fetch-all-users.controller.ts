import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { UserTypes } from "../../../domain/entities/user/user";
import { IPaginationInput, parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";
import {
    IFetchUsersUseCase
} from "../../../domain/use-cases/user/fetch-users";
import { ok, serverError } from "../helpers";

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
