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
      const {
        limit,
        operation,
        pageNumber,
        resource,
        user_id,
        end_date,
        start_date,
      } = request;

      const { error } = await fetchUserOperationsValidator.validate({
        user_id,
        resource,
        operation,
        limit,
        pageNumber,
        end_date,
        start_date,
      });

      const dto = {
        operation,
        resource,
        user_id,
        end_date,
        start_date,
        ...parsePaginationInput({
          page: pageNumber,
          limit: limit,
        }),
      };

      if (error) {
        return badRequest(error);
      }

      const data = await userOperationLogsService.getAll(dto);

      return ok(data);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
