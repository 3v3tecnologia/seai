import { UserOperationsRepositoryProtocol } from "./infra/protocol/log-repository";
import { UserOperationsLoggerProtocol } from "./protocols/logger";

export class UserOperationsLogger implements UserOperationsLoggerProtocol {
  constructor(
    private readonly resource: string,
    private readonly operation: string,
    private readonly repository: UserOperationsRepositoryProtocol
  ) {}

  async save(user_id: number, description: string): Promise<void> {
    await this.repository.save({
      description,
      user_id,
      operation: this.operation,
      resource: this.resource,
    });
  }
}
