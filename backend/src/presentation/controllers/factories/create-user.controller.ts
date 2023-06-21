import { CreateUserUseCase } from "../../../domain/use-cases/user/create-user/create-user";
import { CreateUserController } from "../user-controller/create.controller";

export const makeCreateUserController = () => {
  const userRepository = "";
  const useCase = new CreateUserUseCase();
  const controller = new CreateUserController();
};
