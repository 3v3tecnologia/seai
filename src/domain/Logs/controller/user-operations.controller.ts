import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { parsePaginationInput } from "../../../shared/utils/pagination";

import { userOperationLogsService } from "../services";
import { fetchUserOperationsValidator } from "./schema";
import { GetAllInput } from "./schema/request";

export class UserOperationsController {
  static async getAll(request: GetAllInput): Promise<HttpResponse> {
    try {
      const { error } = await fetchUserOperationsValidator.validate(request);

      if (error) {
        return badRequest(error);
      }

      const data = await userOperationLogsService.getAll({
        ...request,
        ...parsePaginationInput({
          page: request.pageNumber,
          limit: request.limit,
        }),
      });

      return ok(data);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
