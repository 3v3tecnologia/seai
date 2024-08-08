import { ISchemaValidator } from "../../../../shared/infra/validator/validator";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  created,
  forbidden,
  serverError,
} from "../../../../shared/utils/http-responses";
import { UpdateUserProfile } from "../services";

export class UpdateUserProfileController {
  private updateUser: UpdateUserProfile;
  private validator: ISchemaValidator;

  constructor(updateUser: UpdateUserProfile, validator: ISchemaValidator) {
    this.updateUser = updateUser;
    this.validator = validator;
  }

  async handle(
    request: UpdateUserProfileController.Request
  ): Promise<HttpResponse> {
    try {
      const { accountId, email, login, name } = request;

      // const { error } = await this.validator.validate({
      //   accountId,
      //   email,
      //   login,
      //   name,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      const dto = {
        id: accountId,
        name: name as string,
        login: login as string,
      };

      if (email) {
        Object.assign(dto, {
          email: email,
        });
      }

      const updateOrError = await this.updateUser.execute(dto);

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}

export namespace UpdateUserProfileController {
  export type Request = {
    accountId: number;
    email?: string;
    login: string;
    name: string;
  };
}
