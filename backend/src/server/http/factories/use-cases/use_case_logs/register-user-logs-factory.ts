import { RegisterUserLogs } from "../../../../../domain/use-cases/use-cases-logs/register-user-logs";
import { KnexLogOperationsRepository } from "../../../../../infra/database/postgres/repositories/log-operations-repository";

export const makeRegisterUserLogs = (): RegisterUserLogs => {
  const accountRepository = new KnexLogOperationsRepository();
  return new RegisterUserLogs(accountRepository);
};
