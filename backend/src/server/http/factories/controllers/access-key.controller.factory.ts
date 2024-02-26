import {
  DeleteAccessKeyController,
  FetchAccessKeyByIdController,
  FetchAccessKeysController,
  RegisterAccessKeyController,
  UpdateAccessKeyController,
} from "../../../../presentation/controllers/api-key";
import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { makeLogControllerDecorator } from "../decorators";
import { AccessKeyUseCasesFactory } from "../use-cases";

export class AccessKeyControllerFactory {
  static makeDelete(): Controller {
    return makeLogControllerDecorator(
      new DeleteAccessKeyController(
        AccessKeyUseCasesFactory.makeDeleteAccessKey()
      )
    );
  }

  static makeFetchAccessKeyById(): Controller {
    return new FetchAccessKeyByIdController(
      AccessKeyUseCasesFactory.makeFetchAccessKeyById()
    );
  }

  static makeFetchAccessKeys(): Controller {
    return new FetchAccessKeysController(
      AccessKeyUseCasesFactory.makeFetchAccessKeys()
    );
  }

  static makeRegister(): Controller {
    return makeLogControllerDecorator(
      new RegisterAccessKeyController(
        AccessKeyUseCasesFactory.makeRegisterAccessKey()
      )
    );
  }

  static makeUpdate(): Controller {
    return makeLogControllerDecorator(
      new UpdateAccessKeyController(
        AccessKeyUseCasesFactory.makeUpdateAccessKey()
      )
    );
  }
}
