import { parsePaginationInput } from "../../../domain/use-cases/helpers/pagination";
import {
  badRequest,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
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
