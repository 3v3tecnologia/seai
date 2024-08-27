import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../../../shared/utils/pagination";
import { UserOperation } from "../../../model/user-operations";

export interface UserOperationsRepositoryProtocol {
  getAll(
    params: {
      user_id?: number;
      resource?: string;
      operation?: string;
    } & IPaginationInput
  ): Promise<IOutputWithPagination<UserOperation>>;

  getById(id: number): Promise<UserOperation | null>;
}
