import { UserOperationsRepository } from "../infra/user-operations.repository";
import { UserOperationsService } from "./user-operations.service";

export const makeUserOperationLogs = () => {
  return new UserOperationsService(new UserOperationsRepository());
};
