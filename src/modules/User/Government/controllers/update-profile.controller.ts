import {
  created,
  forbidden,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../../presentation/controllers/ports";
import { UpdateUserProfile } from "../services";

export class UpdateUserProfileController {
  private updateUser: UpdateUserProfile;

  constructor(updateUser: UpdateUserProfile) {
    this.updateUser = updateUser;
  }

  async handle(
    request: UpdateUserProfileController.Request
  ): Promise<HttpResponse> {
    try {
      console.log(request);
      const { accountId, email, login, name } = request;

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
