import { UserOperationControllerDTO } from "../../../../@types/login-user";
import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  ok,
} from "../../../../shared/utils/http-responses";
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

    const { error } = await this.validator.validate({
      ...dto,
      Operation: request.Operation,
      accountId: request.accountId,
    });

    if (error) {
      return badRequest(error);
    }

    const result = await this.deleteUser.execute(dto, {
      author: request.accountId,
      operation: request.Operation,
    });

    if (result.isLeft()) {
      return forbidden(result.value);
    }
    return ok(result.value);
  }
}

export namespace DeleteUserController {
  export type Request = {
    id: number;
    email?: string;
  } & UserOperationControllerDTO;
}
