import { makeIrrigationUserAccountService } from "../../services/factories/account";
import { IrrigantAccountControllers } from "../account.controller";

export const makeIrrigantAccountController = (): IrrigantAccountControllers => {
  return new IrrigantAccountControllers(makeIrrigationUserAccountService());
};
