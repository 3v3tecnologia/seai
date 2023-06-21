import { Controller } from "../../../../presentation/controllers/ports/controllers";
import { CreateUserController } from "../../../../presentation/controllers/user-controller/create.controller";
import { makeCreateUser } from "../use-cases/user/create-user-usecase-factory";

export const makeCreateUserController = (): Controller => {
  return new CreateUserController(makeCreateUser());
};
