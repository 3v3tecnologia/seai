import { forbidden, serverError, ok } from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { Logger } from "../../../shared/logger/logger";
import { GetCropsIndicatorsFromBasinUseCaseProtocol } from "../services/fetch-crops-indicators-by-basin";


export class GetCulturesIndicatorsFromBasinController {
  private useCase: GetCropsIndicatorsFromBasinUseCaseProtocol.UseCase;

  constructor(useCase: GetCropsIndicatorsFromBasinUseCaseProtocol.UseCase) {
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
      return serverError(error as Error);
    }
  }
}

export namespace GetCulturesIndicatorsFromBasinControllerProtocol {
  export type Request = {
    id: number;
  };
}
