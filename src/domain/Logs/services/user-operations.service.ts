import { UserOperationsRepositoryProtocol } from "../infra/repository/protocol/log-repository";
import { UserOperationServiceProtocol } from "../protocols/user-operations.protocol";
import { GetAllService } from "./user-operations.dto";

export class UserOperationsService implements UserOperationServiceProtocol {
  constructor(private readonly repository: UserOperationsRepositoryProtocol) {}
  async getAll(input: GetAllService.Input): Promise<GetAllService.Output> {
    return await this.repository.getAll(input);
  }
}
