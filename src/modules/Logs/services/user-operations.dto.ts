import {
  IOutputWithPagination,
  IPaginationInput,
} from "../../../domain/use-cases/helpers/pagination";
import { UserOperation } from "../model/user-operations";

export namespace GetAllService {
  export type Input = {
    user_id?: number;
    resource?: string;
    operation?: string;
  } & IPaginationInput;

  export type Output = IOutputWithPagination<UserOperation>;
}
