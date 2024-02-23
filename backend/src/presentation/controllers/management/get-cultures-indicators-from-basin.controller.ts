import { HttpResponse } from "../ports";

import { GetCulturesIndicatorsFromBasinUseCaseProtocol } from "../../../domain/use-cases/management/get-cultures-indicators-from-basin";
import { created, forbidden, ok, serverError } from "../helpers";

export class GetCulturesIndicatorsFromBasinController {
  private useCase: GetCulturesIndicatorsFromBasinUseCaseProtocol.UseCase;

  constructor(useCase: GetCulturesIndicatorsFromBasinUseCaseProtocol.UseCase) {
    this.useCase = useCase;
  }

  async handle(
    request: GetCulturesIndicatorsFromBasinControllerProtocol.Request
  ): Promise<HttpResponse> {
    try {
      const culturesOrError = await this.useCase.execute({
        IdBasin: Number(request.id),
      });

      if (culturesOrError.isLeft()) {
        return forbidden(culturesOrError.value);
      }

      const cultures = culturesOrError.value;

      if (cultures) {
        return ok({
          Id: cultures?.Id,
          Cultures: cultures.Cultures
            ? Object.fromEntries(cultures.Cultures)
            : null,
        });
      }

      return ok(null);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace GetCulturesIndicatorsFromBasinControllerProtocol {
  export type Request = {
    id: number;
  };
}
