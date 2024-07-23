import {
  created,
  forbidden,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { FetchSubscribersEmailUseCaseProtocol } from "../services";

export class FetchNewsletterSubscribersEmailsController {
  private useCase: FetchSubscribersEmailUseCaseProtocol.UseCase;

  constructor(useCase: FetchSubscribersEmailUseCaseProtocol.UseCase) {
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
  export type Request = void;
}
