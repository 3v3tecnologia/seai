import { HttpResponse } from "../ports";

import { FetchSubscribersEmailUseCaseProtocol } from "../../../domain/use-cases/newsletter/fetch-subscribers-emails";
import { created, forbidden, serverError } from "../helpers";

export class FetchNewsletterSubscribersEmailsController {
    private useCase: FetchSubscribersEmailUseCaseProtocol.UseCase;

    constructor(
        useCase: FetchSubscribersEmailUseCaseProtocol.UseCase,
    ) {
        this.useCase = useCase;
    }

    async handle(
        request: FetchNewsletterSubscribersEmailsControllerProtocol.Request
    ): Promise<HttpResponse> {
        try {
            const resultOrError = await this.useCase.execute();


            if (resultOrError.isLeft()) {
                return forbidden(resultOrError.value);
            }

            return created(resultOrError.value);
        } catch (error) {
            console.error(error);
            return serverError(error as Error);
        }
    }
}

export namespace FetchNewsletterSubscribersEmailsControllerProtocol {
    export type Request = void
}
