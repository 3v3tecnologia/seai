import { ForgotPassword } from "../../../../../domain/use-cases/user/forgot-password/forgot-password";
import { AccountRepository } from "../../../../../infra/database/postgres/repositories/account-repository";

export const makeForgotPasswordUser = (): ForgotPassword => {
  const accountRepository = new AccountRepository();
  return new CreateUser(userRepository);
};
