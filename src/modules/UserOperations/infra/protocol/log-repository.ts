import { UserOperation } from "../../model/user-operations";

export interface UserOperationsRepositoryProtocol {
  getAll(input: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<Array<UserOperation> | null>;

  getById(id: number): Promise<UserOperation | null>;
}
