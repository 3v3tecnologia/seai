import { FetchCronController } from "../../../../../presentation/controllers/jobs";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchCronUseCase } from "../../use-cases";

export const makeFetchCronController = (): Controller => {
  return new FetchCronController(makeFetchCronUseCase());
};
