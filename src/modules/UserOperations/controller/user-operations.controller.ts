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

  async getAll(input: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<HttpResponse> {
    try {
      const { operation, resource, user_id } = input;

      const dto = {
        operation,
        resource,
        user_id,
      };

      const { error } = await fetchUserOperationsValidator.validate(dto);

      if (error) {
        return badRequest(error);
      }

      const data = await this.service.getAll(dto);

      return ok(data);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
