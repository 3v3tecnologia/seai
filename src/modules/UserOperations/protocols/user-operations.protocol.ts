import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../domain/use-cases/helpers/pagination";
import { UserOperation } from "../model/user-operations";

export interface UserOperationServiceProtocol {
  getAll(
    input: {
      user_id?: number;
      resource?: string;
      operation?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<UserOperation>>;
}
