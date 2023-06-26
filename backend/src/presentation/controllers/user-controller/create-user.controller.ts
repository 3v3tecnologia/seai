import { CreateUser } from "../../../domain/use-cases/user/create-user/create-user";
import { HttpResponse } from "../ports";
import { Controller } from "../ports/controllers";

import { badRequest, created, forbidden, ok, serverError } from "../helpers";
import { CreateUserDTO } from "../../../domain/use-cases/user/create-user/ports";
import { Validator } from "../../../shared/validation/ports/validator";

// Controllers são classes puras e não devem depender de frameworks
export class CreateUserController implements Controller {
  private createUser: CreateUser;
  private validator: Validator;

  constructor(createUser: CreateUser, validator: Validator) {
    this.createUser = createUser;
    this.validator = validator;
  }

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    try {
      console.log("request = > ", request);

      const error = this.validator.validate(request);

      if (error.isLeft()) {
        return badRequest(error.value);
      }

      const { email, modules, type } = request;

      const createdOrError = await this.createUser.create({
        email,
        modules,
        type,
      });

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }
      //Add validation here
      return created(createdOrError.value);
    } catch (error) {
      console.error(error)
      return serverError(error as Error);
    }
  }
}

export namespace CreateUserController {
  export type Request = CreateUserDTO.Params;
}
