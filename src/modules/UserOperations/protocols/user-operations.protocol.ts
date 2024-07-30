import { UserOperation } from "../model/user-operations";

export interface UserOperationServiceProtocol {
  getAll(input: {
    user_id?: string;
    resource?: string;
    operation?: string;
  }): Promise<Array<UserOperation> | null>;
}
