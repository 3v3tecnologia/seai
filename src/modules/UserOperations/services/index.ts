import { UserOperationsRepository } from "../infra/repository/user-operations.repository";
import { UserOperationsService } from "./user-operations.service";

export const userOperationLogsService = new UserOperationsService(
  new UserOperationsRepository()
);
