import { ISchemaValidator } from "../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import {
  ICalculateIndicatorsWeightsService,
  IGetBasinService,
  IGetIndicatorsWeightsByBasinService,
  IGetWaterCutService,
  InsertIndicatorsWeightsService,
} from "../services/indicators-weights";

export interface IInsertIndicatorsWeightsController {
  handle(request: {
    basin_ids: Array<number>;
    year: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse>;
}

export class InsertIndicatorsWeightsController
  implements IInsertIndicatorsWeightsController
{
  constructor(
    private readonly indicatorsWeightsService: InsertIndicatorsWeightsService,
    private readonly validator: ISchemaValidator
  ) {}
  async handle(request: {
    basin_ids: Array<number>;
    year: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse> {
    try {
      const { basin_ids, year, data } = request;

      const { error } = await this.validator.validate({
        basin_ids,
        year,
        data,
      });

      if (error) {
        return badRequest(error);
      }

      const deletedOrError = await this.indicatorsWeightsService.save({
        basin_ids,
        year,
        weights: data,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      return created(deletedOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export class GetIndicatorWeightsByBasinsIdsController {
  constructor(
    private readonly indicatorsWeightsService: IGetIndicatorsWeightsByBasinService,
    private readonly validator: ISchemaValidator
  ) {}

  async handle(request: {
    basin_ids: string;
    year: number;
  }): Promise<HttpResponse> {
    try {
      const { error } = await this.validator.validate({
        basin_ids: request.basin_ids,
        year: request.year,
      });

      if (error) {
        return badRequest(error);
      }

      const ids = request.basin_ids.split(",").map((id) => Number(id));

      const resultOrError = await this.indicatorsWeightsService.getByBasinsIds({
        basin_ids: ids,
        year: request.year,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
export class CalculateIndicatorWeightsController {
  constructor(
    private readonly indicatorsWeightsService: ICalculateIndicatorsWeightsService,
    private readonly validator: ISchemaValidator
  ) {}

  async handle(request: { basin_ids: Array<number> }): Promise<HttpResponse> {
    try {
      const { basin_ids } = request;

      const { error } = await this.validator.validate({
        basin_ids,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await this.indicatorsWeightsService.calculate({
        basin_ids,
      });

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export interface ICalculateWaterCutController {
  handle(request: { basin_ids: Array<number> }): Promise<HttpResponse>;
}

export class CalculateWatercutController
  implements ICalculateWaterCutController
{
  constructor(
    private readonly indicatorsWeightsService: IGetWaterCutService,
    private readonly validator: ISchemaValidator
  ) {}

  async handle({
    basin_ids,
  }: {
    basin_ids: Array<number>;
  }): Promise<HttpResponse> {
    try {
      const { error } = await this.validator.validate({
        basin_ids,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await this.indicatorsWeightsService.getWaterCut(
        basin_ids
      );

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export class GetBasinController {
  constructor(private readonly indicatorsWeightsService: IGetBasinService) {}

  async handle(): Promise<HttpResponse> {
    try {
      const resultOrError = await this.indicatorsWeightsService.getBasin();

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
