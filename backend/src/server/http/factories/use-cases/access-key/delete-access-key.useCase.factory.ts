import {
  DeleteAccessKeyUseCaseProtocol,
  DeleteRegisterAccessKey,
} from "../../../../../domain/use-cases/access-key";
import { DbAccessKeyRepository } from "../../../../../infra/database/postgres/repositories/access-key.repository";

export const makeDeleteAccessKeyUseCase =
  (): DeleteAccessKeyUseCaseProtocol.UseCase => {
    return new DeleteRegisterAccessKey(new DbAccessKeyRepository());
  };
