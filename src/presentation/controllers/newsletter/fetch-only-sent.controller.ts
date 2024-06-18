import { HttpResponse } from "../ports";

import { IPaginationInput, parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";
import { FetchOnlySentNews } from "../../../domain/use-cases/newsletter/fetch-only-sent";
import { badRequest, forbidden, ok, serverError } from "../helpers";
import { ISchemaValidator } from "../../../shared/validation/validator";

export class FetchOnlySentNewsController {
    private useCase: FetchOnlySentNews.UseCase;
    private validator: ISchemaValidator;

    constructor(useCase: FetchOnlySentNews.UseCase, validator: ISchemaValidator) {
        this.useCase = useCase;
        this.validator = validator
    }

    async handle(request: FetchOnlySentNewsController.Request): Promise<HttpResponse> {
        try {
            const { limit, offset, pageNumber } = request

            const toValidate = {
                limit, offset, pageNumber
            }

            if (Reflect.has(request, 'title')) {
                Object.assign(toValidate, {
                    title: request.title
                })
            }

            const { error } = await this.validator.validate(toValidate)

            if (error) {
                return badRequest(error)
            }

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
