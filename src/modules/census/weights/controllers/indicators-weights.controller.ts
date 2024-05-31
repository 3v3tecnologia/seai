import { formatPaginationInput } from "../../../../domain/use-cases/helpers/formatPaginationInput";
import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { CensusCultureWeights } from "../core/model/indicators-weights";
import { ICreateIndicatorsWeightsService, IGetIndicatorsWeightsByBasinService } from "../services/indicators-weights";


export interface ICreateIndicatorsWeightsController {
  handle(request: {
    accountId: number;
    id: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse>

}

export class CreateIndicatorsWeightsController implements ICreateIndicatorsWeightsController {
  constructor(private readonly indicatorsWeightsService: ICreateIndicatorsWeightsService, private readonly validator: ISchemaValidator) { }
  async handle(request: {
    accountId: number;
    id: number;
    data: Array<CensusCultureWeights>;
  }): Promise<HttpResponse> {
    try {

      const {
        id,
        data
      } = request

      const { error } = await this.validator.validate({ id, data });

      if (error) {
        return badRequest(error)
      }

      const deletedOrError = await this.indicatorsWeightsService.create({
        id_basin: Number(id),
        weights: data,
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      //   await this.userLogs.log(request.accountId, this.useCase);

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

}

export interface IGetIndicatorsWeightsByBasinController {
  handle(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse>
}

export class GetIndicatorWeightsByBasinController implements IGetIndicatorsWeightsByBasinController {
  constructor(private readonly indicatorsWeightsService: IGetIndicatorsWeightsByBasinService, private readonly validator: ISchemaValidator) { }

  async handle(
    request: {
      accountId: number;
      id: number;
    }
  ): Promise<HttpResponse> {
    try {
      const {
        id
      } = request

      const { error } = await this.validator.validate({ id });

      if (error) {
        return badRequest(error)
      }

      const resultOrError = await this.indicatorsWeightsService.getByBasin({
        id_basin: Number(request.id),
      });


      if (resultOrError.isLeft()) {
        return badRequest(resultOrError.value);
      }

      return ok(resultOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
