import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ISchemaValidator } from "../../../shared/validation/validator";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { ICalculateIndicatorsWeightsService, IGetIndicatorsWeightsByBasinService, IGetWaterCutService, InsertIndicatorsWeightsService } from "../services/indicators-weights";


export interface IInsertIndicatorsWeightsController {
  handle(request: {
    basin_ids: Array<number>;
    year: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse>

}

export class InsertIndicatorsWeightsController implements IInsertIndicatorsWeightsController {
  constructor(private readonly indicatorsWeightsService: InsertIndicatorsWeightsService, private readonly validator: ISchemaValidator) { }
  async handle(request: {
    basin_ids: Array<number>;
    year: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse> {
    try {

      const {
        basin_ids,
        year,
        data
      } = request

      const { error } = await this.validator.validate({
        basin_ids,
        year,
        data
      });

      if (error) {
        return badRequest(error)
      }

      const deletedOrError = await this.indicatorsWeightsService.save({
        basin_ids,
        year,
        weights: data,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return created(deletedOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

}

export interface IGetIndicatorWeightsByBasinsIdsController {
  handle(
    request: {
      basin_ids: Array<number>;
      year: number;
    }
  ): Promise<HttpResponse>
}

export class GetIndicatorWeightsByBasinsIdsController implements IGetIndicatorWeightsByBasinsIdsController {
  constructor(private readonly indicatorsWeightsService: IGetIndicatorsWeightsByBasinService, private readonly validator: ISchemaValidator) { }

  async handle(
    request: {
      basin_ids: Array<number>;
      year: number;
    }
  ): Promise<HttpResponse> {
    try {
      const {
        basin_ids,
        year
      } = request

      const { error } = await this.validator.validate({
        basin_ids,
        year
      });

      if (error) {
        return badRequest(error)
      }

      const resultOrError = await this.indicatorsWeightsService.getByBasinsIds({
        basin_ids,
        year
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

export interface ICalculateIndicatorWeightsController {
  handle(
    request: {
      basin_ids: Array<number>;
      area?: number;
      users_registered_count?: number;
      crops_names?: Array<string>
    }
  ): Promise<HttpResponse>
}

export class CalculateIndicatorWeightsController implements ICalculateIndicatorWeightsController {
  constructor(private readonly indicatorsWeightsService: ICalculateIndicatorsWeightsService, private readonly validator: ISchemaValidator) { }

  async handle(
    request: {
      basin_ids: Array<number>;
      area?: number;
      users_registered_count?: number;
      crops_names?: Array<string>
    }
  ): Promise<HttpResponse> {
    try {
      const {
        basin_ids,
        area,
        crops_names,
        users_registered_count
      } = request

      const { error } = await this.validator.validate({
        basin_ids,
        area,
        crops_names,
        users_registered_count
      });

      if (error) {
        return badRequest(error)
      }

      const resultOrError = await this.indicatorsWeightsService.calculate({
        basin_ids,
        area,
        crops_names,
        users_registered_count
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
  handle(request:{basin_ids: Array<number>}): Promise<HttpResponse>
}

export class CalculateWatercutController implements ICalculateWaterCutController {
  constructor(private readonly indicatorsWeightsService: IGetWaterCutService, private readonly validator: ISchemaValidator) { }

  async handle({basin_ids}:{basin_ids: Array<number>}): Promise<HttpResponse> {
    try {

      const { error } = await this.validator.validate({
        basin_ids
      });

      if (error) {
        return badRequest(error)
      }

      const resultOrError = await this.indicatorsWeightsService.getWaterCut(basin_ids);


      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

