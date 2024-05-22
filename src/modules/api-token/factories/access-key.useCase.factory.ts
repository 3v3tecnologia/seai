import {
  DeleteAccessKeyUseCaseProtocol,
  DeleteRegisterAccessKey,
  FetchAccessKeyById,
  FetchAccessKeyByIdUseCaseProtocol,
  FetchAccessKeys,
  FetchAccessKeysUseCaseProtocol,
  RegisterAccessKey,
  RegisterAccessKeyUseCaseProtocol,
  UpdateAccessKeyUseCaseProtocol,
  UpdateRegisterAccessKey,
} from "../../../../modules/api-token/services";
import { DbAccessKeyRepository } from "../../../../shared/db/database/postgres/repositories/access-key.repository";

export class AccessKeyUseCasesFactory {
  private static repository = new DbAccessKeyRepository();

  static makeFetchAccessKeys(): FetchAccessKeysUseCaseProtocol.UseCase {
    return new FetchAccessKeys(this.repository);
  }

  static makeFetchAccessKeyById(): FetchAccessKeyByIdUseCaseProtocol.UseCase {
    return new FetchAccessKeyById(this.repository);
  }

  static makeDeleteAccessKey(): DeleteAccessKeyUseCaseProtocol.UseCase {
    return new DeleteRegisterAccessKey(this.repository);
  }

  static makeRegisterAccessKey(): RegisterAccessKeyUseCaseProtocol.UseCase {
    return new RegisterAccessKey(this.repository);
  }

  static makeUpdateAccessKey(): UpdateAccessKeyUseCaseProtocol.UseCase {
    return new UpdateRegisterAccessKey(this.repository);
  }
}
