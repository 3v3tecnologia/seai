import { RegisterUserLogs } from "../../../../../domain/use-cases/logs/register-user-logs";
import { LogOperationsRepository } from "../../../../../infra/database/postgres/repositories/log-operations-repository";

export const makeRegisterUserLogs = (): RegisterUserLogs => {
  const accountRepository = new LogOperationsRepository();
  return new RegisterUserLogs(accountRepository);
};
