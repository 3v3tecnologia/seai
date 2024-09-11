import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { censusWeightsService } from "../services";
import { calculateIndicatorsWeightsValidator, createIndicatorsWeightsValidator, getIndicatorsWeightsValidator, getWaterCutValidator } from "./schema/weights";

export class IndicatorsWeightsController {

  static async create(request: {
    basin_ids: Array<number>;
    year: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse> {
    try {
      const { basin_ids, year, data } = request;

      const { error } = await createIndicatorsWeightsValidator.validate({
        basin_ids,
        year,
        data,
      });

      if (error) {
        return badRequest(error);
      }

      const deletedOrError = await censusWeightsService.create({
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

  static async getByBasinIds(request: {
    basin_ids: string;
    year: number;
  }): Promise<HttpResponse> {
    try {
      const { error } = await getIndicatorsWeightsValidator.validate({
        basin_ids: request.basin_ids,
        year: request.year,
      });

      if (error) {
        return badRequest(error);
      }

      const ids = request.basin_ids.split(",").map((id) => Number(id));

      const resultOrError = await censusWeightsService.getByBasinsIds({
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

  static async calculateWeights(request: { basin_ids: Array<number> }): Promise<HttpResponse> {
    try {
      const { basin_ids } = request;

      const { error } = await calculateIndicatorsWeightsValidator.validate({
        basin_ids,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await censusWeightsService.calculate({
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

  static async getBasin(): Promise<HttpResponse> {
    try {
      const resultOrError = await censusWeightsService.getBasin();

      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getWaterCut({
    basin_ids,
  }: {
    basin_ids: Array<number>;
  }): Promise<HttpResponse> {
    try {
      const { error } = await getWaterCutValidator.validate({
        basin_ids,
      });

      if (error) {
        return badRequest(error);
      }

      const resultOrError = await censusWeightsService.getWaterCut(
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