import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../domain/use-cases/helpers/pagination";
import {
  badRequest,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { UserOperationServiceProtocol } from "../protocols/user-operations.protocol";
import { fetchUserOperationsValidator } from "./schema";

export class UserOperationsController {
  constructor(private readonly service: UserOperationServiceProtocol) {}

  async getAll(
    input: {
      user_id?: number;
      resource?: string;
      operation?: string;
    } & IPaginationInput
  ): Promise<HttpResponse> {
    try {
      const { operation, resource, user_id, limit, offset, pageNumber } = input;

      const { error } = await fetchUserOperationsValidator.validate({
        operation,
        resource,
        user_id,
        limit,
        offset,
        pageNumber,
      });

      if (error) {
        return badRequest(error);
      }

      const data = await this.service.getAll({
        operation,
        resource,
        user_id,
        ...parsePaginationInput({
          page: pageNumber,
          limit: limit,
        }),
      });

      return ok(data);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
