import {
  badRequest,
  forbidden,
  ok,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { DeleteUser } from "../services";

export class DeleteUserController {
  private deleteUser: DeleteUser;
  private validator: ISchemaValidator;

  constructor(deleteUser: DeleteUser, validator: ISchemaValidator) {
    this.deleteUser = deleteUser;
    this.validator = validator;
  }

  async handle(request: DeleteUserController.Request): Promise<HttpResponse> {
    const dto = {
      id: Reflect.has(request, "id") ? request.id : request.accountId,
    };

    if (request.email) {
      Object.assign(dto, {
        email: request.email,
      });
    }

    // if (
    //   [Reflect.has(dto, "id"), Reflect.has(dto, "email")].every(
    //     (c) => c == false
    //   )
    // ) {
    //   return forbidden(
    //     new Error("Necessário informar a identificação do usuário")
    //   );
    // }

    const { error } = await this.validator.validate(dto);

    if (error) {
      return badRequest(error);
    }

    const result = await this.deleteUser.execute(dto);

    if (result.isLeft()) {
      return forbidden(result.value);
    }
    return ok(result.value);
  }
}

export namespace DeleteUserController {
  export type Request = {
    accountId: number;
    id: number;
    email?: string;
  };
}
