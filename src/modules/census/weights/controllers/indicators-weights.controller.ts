import { formatPaginationInput } from "../../../../domain/use-cases/helpers/formatPaginationInput";
import { IPaginationInput } from "../../../../domain/use-cases/helpers/pagination";
import {
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { IIndicatorsWeightsServices, makeIndicatorsWeightsServices } from "../services/indicators-weights";


export interface IIndicatorsWeightsController {
  create(request: {
    accountId: number;
    id: number;
    data: Array<any>;
  }): Promise<HttpResponse>
  getByBasin(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse>
}

export class IndicatorWeightsController implements IIndicatorsWeightsController {
  constructor(private readonly indicatorsWeightsServices: IIndicatorsWeightsServices) {

  }
  async create(request: {
    accountId: number;
    id: number;
    data: Array<any>;
  }): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.indicatorsWeightsServices.create({
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

  async getByBasin(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await this.indicatorsWeightsServices.getByBasin({
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

export const makeIndicatorWeightsController = () => new IndicatorWeightsController(makeIndicatorsWeightsServices())