import { FetchPluviometerReadsByIdReadController } from "../../../../../presentation/controllers/equipments-controller";
import { Controller } from "../../../../../presentation/controllers/ports/controllers";
import { makeFetchPluviometerReadsByIdRead } from "../../use-cases/equipments";

export const makeFetchPluviometerReadsByIdReadController = (): Controller => {
  return new FetchPluviometerReadsByIdReadController(
    makeFetchPluviometerReadsByIdRead()
  );
};
