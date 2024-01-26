import {
  FetchAccessKeyById,
  FetchAccessKeyByIdUseCaseProtocol,
} from "../../../../../domain/use-cases/access-key";
import { DbAccessKeyRepository } from "../../../../../infra/database/postgres/repositories/access-key.repository";

export const makeFetchAccessKeyByIdUseCase =
  (): FetchAccessKeyByIdUseCaseProtocol.UseCase => {
    return new FetchAccessKeyById(new DbAccessKeyRepository());
  };
