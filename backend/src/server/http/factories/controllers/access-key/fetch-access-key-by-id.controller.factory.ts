import { FetchAccessKeyByIdController } from "../../../../../presentation/controllers/api-key";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchAccessKeyByIdUseCase } from "../../use-cases/access-key/fetch-access-key.useCase.factory";

export const makeFetchAccessKeyByIdController = (): Controller => {
  return new FetchAccessKeyByIdController(makeFetchAccessKeyByIdUseCase());
};
