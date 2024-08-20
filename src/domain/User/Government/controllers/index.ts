import { makeGovernmentUserService } from "../services";
import { GovernmentUserController } from "./user.controller";

export const makeGovernmentUserController = () => {
  return new GovernmentUserController(makeGovernmentUserService());
};
