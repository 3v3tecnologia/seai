import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { Logger } from "../../../shared/utils/logger";
import { IPaginationInput } from "../../../shared/utils/pagination";

import { CropStudies } from "../core/model/crop-studies";
import { censusStudiesService } from "../services";
import { createStudiesValidator, getStudiesValidator } from "./schema/studies";

export class CropStudiesController {
  static async create(request: {
    accountId: number;
    id: number;
    data: Array<Omit<CropStudies, "id_basin">>;
  }): Promise<HttpResponse> {
    try {
      const { data, id } = request;

      const { error } = await createStudiesValidator.validate({ id, data });

      if (error) {
        return badRequest(error);
      }

      const successOrError = await censusStudiesService.create({
        id_basin: request.id,
        data: request.data,
      });

      if (successOrError.isLeft()) {
        return badRequest(successOrError.value);
      }

      return created(successOrError.value);
    } catch (error) {
      if (error instanceof Error) {
        Logger.error(error.message);
      }
      return serverError(error as Error);
    }
  }
  static async getByBasin(
    request: {
      accountId: number;
      id: number;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const { id } = request;

      const { error } = await getStudiesValidator.validate({ id });

      if (error) {
        return badRequest(error);
      }

      const deletedOrError = await censusStudiesService.getByBasin(
        request.id
      );

      if (deletedOrError.isLeft()) {
        return badRequest(deletedOrError.value);
      }

      return ok(deletedOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}