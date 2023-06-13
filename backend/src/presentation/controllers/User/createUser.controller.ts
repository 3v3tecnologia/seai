import { Request, Response } from "express";

import { CreateUserUseCase } from "../../../services/User/create-user/create-user";

export class CreateUserController {
  private createUserUseCase: CreateUserUseCase;

  constructor(createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }
  async handle(request: Request, response: Response) {
    await this.createUserUseCase.execute();
    //Add validation here
    return response.status(201).json({
      msg: "Hello my friend",
    });
  }
}
