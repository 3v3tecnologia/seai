import { UserOperationsRepositoryProtocol } from "../infra/protocol/log-repository";
import { UserOperation } from "../model/user-operations";
import { UserOperationServiceProtocol } from "../protocols/user-operations.protocol";

export class UserOperationsService implements UserOperationServiceProtocol {
  constructor(private readonly repository: UserOperationsRepositoryProtocol) {}
  async getAll(input: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<Array<UserOperation> | null> {
    return await this.repository.getAll(input);
  }
}
