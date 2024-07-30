import {
  badRequest,
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { ISchemaValidator } from "../../../../shared/validation/validator";
import { CompleteUserRegister } from "../services";

export class CompleteUserRegisterController {
  private updateUser: CompleteUserRegister;
  private validator: ISchemaValidator;

  constructor(updateUser: CompleteUserRegister, validator: ISchemaValidator) {
    this.updateUser = updateUser;
    this.validator = validator;
  }

  async handle(
    request: CompleteUserRegisterDTO.Request
  ): Promise<HttpResponse> {
    try {
      const { code, confirmPassword, login, name, password } = request;

      const dto = {
        code,
        confirmPassword,
        login,
        name,
        password,
      };

      // const { error } = await this.validator.validate(dto);

      // if (error) {
      //   return badRequest(error);
      // }

      const updateOrError = await this.updateUser.execute(dto);

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.updateUser);

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace CompleteUserRegisterDTO {
  export type Request = {
    code: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  };
}
