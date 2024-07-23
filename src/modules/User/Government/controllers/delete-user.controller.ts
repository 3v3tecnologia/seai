import { forbidden, ok } from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { DeleteUser } from "../services";

export class DeleteUserController {
  private deleteUser: DeleteUser;

  constructor(deleteUser: DeleteUser) {
    this.deleteUser = deleteUser;
  }

  async handle(request: DeleteUserController.Request): Promise<HttpResponse> {
    const dto = {
      id: Reflect.has(request, "id") ? request.id : request.accountId,
    };

    console.log(dto);

    if (request.email) {
      Object.assign(dto, {
        email: request.email,
      });
    }

    if (
      [Reflect.has(dto, "id"), Reflect.has(dto, "email")].every(
        (c) => c == false
      )
    ) {
      return forbidden(
        new Error("Necessário informar a identificação do usuário")
      );
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
