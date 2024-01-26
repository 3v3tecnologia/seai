import {
  FetchAccessKeys,
  FetchAccessKeysUseCaseProtocol,
} from "../../../../../domain/use-cases/access-key";
import { DbAccessKeyRepository } from "../../../../../infra/database/postgres/repositories/access-key.repository";

export const makeFetchAccessKeysUseCase =
  (): FetchAccessKeysUseCaseProtocol.UseCase => {
    return new FetchAccessKeys(new DbAccessKeyRepository());
  };
