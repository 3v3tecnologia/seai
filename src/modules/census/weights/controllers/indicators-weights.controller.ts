import { formatPaginationInput } from "../../../../domain/use-cases/helpers/formatPaginationInput";
import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import {
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { ICreateIndicatorsWeightsService, IGetIndicatorsWeightsByBasinService } from "../services/indicators-weights";


export interface ICreateIndicatorsWeightsController {
  handle(request: {
    accountId: number;
    id: number;
    data: Array<any>;
  }): Promise<HttpResponse>

}

export class CreateIndicatorsWeightsController implements ICreateIndicatorsWeightsController {
  constructor(private readonly indicatorsWeightsService: ICreateIndicatorsWeightsService) { }
  async handle(request: {
    accountId: number;
    id: number;
    data: Array<any>;
  }): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.indicatorsWeightsService.create({
        id_basin: Number(request.id),
        weights: request.data,
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
  constructor(private readonly indicatorsWeightsService: IGetIndicatorsWeightsByBasinService) { }

  async handle(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.indicatorsWeightsService.getByBasin({
        id_basin: Number(request.id),
        ...formatPaginationInput(request.pageNumber, request.limit),
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
