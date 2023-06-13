import { CreateUserUseCase } from "../../../services/User/create-user/create-user";
import { CreateUserController } from "../User/createUser.controller";

class UserControllerFactory {
  get createUser() {
    const createUserUseCase = new CreateUserUseCase();
    const controller = new CreateUserController(createUserUseCase);

    return controller;
  }

  get getAll() {
    return "";
  }

  get find() {
    return "";
  }
}

export default new UserControllerFactory();
