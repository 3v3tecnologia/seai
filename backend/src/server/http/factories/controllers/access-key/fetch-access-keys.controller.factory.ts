import {
  FetchAccessKeyByIdController,
  FetchAccessKeysController,
} from "../../../../../presentation/controllers/api-key";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchAccessKeysUseCase } from "../../use-cases/access-key";

export const makeFetchAccessKeysController = (): Controller => {
  return new FetchAccessKeysController(makeFetchAccessKeysUseCase());
};
