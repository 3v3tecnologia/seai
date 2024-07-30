import { UserOperation } from "../../../../../core/model/user-operations";

export interface UserOperationsRepositoryProtocol {
  save(input: {
    user_id: number;
    resource: string;
    operation: string;
    description: string;
  }): Promise<void>;

  getAll(input: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<Array<UserOperation> | null>;

  getById(id: number): Promise<UserOperation | null>;
}
