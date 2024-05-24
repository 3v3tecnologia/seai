import { HttpResponse } from "../ports";

import { UpdateNewsletterSendAtUseCaseProtocol } from "../../../domain/use-cases/newsletter/update-send-at";
import { forbidden, ok, serverError } from "../helpers";

export class UpdateSendAtController {
    private useCase: UpdateNewsletterSendAtUseCaseProtocol.UseCase;

    constructor(useCase: UpdateNewsletterSendAtUseCaseProtocol.UseCase) {
        this.useCase = useCase;
    }

    async handle(request: UpdateSendAtController.Request): Promise<HttpResponse> {
        try {
            const createdOrError = await this.useCase.execute({
                Id: request.id
            });

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

export namespace UpdateSendAtController {
    export type Request = {
        accountId: number;
        id: number
    };
}
