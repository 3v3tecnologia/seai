import { makeUserOperationLogs } from "../services";
import { UserOperationsController } from "./user-operations.controller";

export const makeUserOperationLogsController = () => {
  return new UserOperationsController(makeUserOperationLogs());
};
