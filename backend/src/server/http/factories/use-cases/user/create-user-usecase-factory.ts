import { CreateUser } from "../../../../../domain/use-cases/user/create-user/create-user";

export const makeCreateUser = (): CreateUser => {
  const userRepository = "";
  return new CreateUser(userRepository);
};
