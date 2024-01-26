import {
  RegisterAccessKey,
  RegisterAccessKeyUseCaseProtocol,
} from "../../../../../domain/use-cases/access-key";
import { DbAccessKeyRepository } from "../../../../../infra/database/postgres/repositories/access-key.repository";

export const makeRegisterAccessKeyUseCase =
  (): RegisterAccessKeyUseCaseProtocol.UseCase => {
    return new RegisterAccessKey(new DbAccessKeyRepository());
  };
