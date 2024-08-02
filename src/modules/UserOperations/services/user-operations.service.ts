import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../domain/use-cases/helpers/pagination";
import { UserOperationsRepositoryProtocol } from "../infra/protocol/log-repository";
import { UserOperation } from "../model/user-operations";
import { UserOperationServiceProtocol } from "../protocols/user-operations.protocol";

export class UserOperationsService implements UserOperationServiceProtocol {
  constructor(private readonly repository: UserOperationsRepositoryProtocol) {}
  async getAll(
    input: {
      user_id?: number;
      resource?: string;
      operation?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<UserOperation>> {
    return await this.repository.getAll(input);
  }
}
