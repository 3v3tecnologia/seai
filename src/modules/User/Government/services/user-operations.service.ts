import { Either, left, right } from "../../../../shared/Either";
import { UserOperation } from "../../core/model/user-operations";
import { UserOperationsRepositoryProtocol } from "../infra/database/repository/protocol/log-repository";
import { UserOperationServiceProtocol } from "./protocols/user-operations.protocol";

export class UserOperationsService implements UserOperationServiceProtocol {
  constructor(private readonly repository: UserOperationsRepositoryProtocol) {}
  async save(input: {
    user_id: number;
    resource: string;
    operation: string;
    description: string;
  }): Promise<void> {
    await this.repository.save(input);
  }
  async getAll(input: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<Array<UserOperation> | null> {
    return await this.repository.getAll(input);
  }
}

export class UserOperationsLogger {
  constructor(
    private readonly resource: string,
    private readonly operation: string,
    private readonly repository: UserOperationsRepositoryProtocol
  ) {}

  async save(
    user_id: number,
    description: string
  ): Promise<Either<Error, void>> {
    try {
      await this.repository.save({
        description,
        user_id,
        operation: this.operation,
        resource: this.resource,
      });

      return right();
    } catch (error) {
      return left(error as Error);
    }
  }
}
