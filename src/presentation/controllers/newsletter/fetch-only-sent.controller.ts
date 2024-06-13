import { HttpResponse } from "../ports";

import { IPaginationInput, parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";
import { FetchOnlySentNews } from "../../../domain/use-cases/newsletter/fetch-only-sent";
import { forbidden, ok, serverError } from "../helpers";

export class FetchOnlySentNewsController {
    private useCase: FetchOnlySentNews.UseCase;

    constructor(useCase: FetchOnlySentNews.UseCase) {
        this.useCase = useCase;
    }

    async handle(request: FetchOnlySentNewsController.Request): Promise<HttpResponse> {
        try {
            const dto = {
                ...parsePaginationInput({
                    page: request.pageNumber,
                    limit: request.limit
                }),
            }

            if (request.title) {
                Object.assign(dto, {
                    title: request.title
                })
            }

            const createdOrError = await this.useCase.execute(dto);

            if (createdOrError.isLeft()) {
                return forbidden(createdOrError.value);
            }

            return ok(createdOrError.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }
}

export namespace FetchOnlySentNewsController {
    export type Request = {
        title?: string;
        // start?: string;
        // end?: string | null;
    } & IPaginationInput;
}
