import {
  UpdateAccessKeyUseCaseProtocol,
  UpdateRegisterAccessKey,
} from "../../../../../domain/use-cases/access-key";
import { DbAccessKeyRepository } from "../../../../../infra/database/postgres/repositories/access-key.repository";

export const makeUpdateAccessKeyUseCase =
  (): UpdateAccessKeyUseCaseProtocol.UseCase => {
    return new UpdateRegisterAccessKey(new DbAccessKeyRepository());
  };
