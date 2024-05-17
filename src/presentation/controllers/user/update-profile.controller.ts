import { HttpResponse } from "../ports";

import { RegisterUserLogs } from "../../../domain/use-cases/system-logs/register-user-logs";
import {
  IUpdateUserProfileUseCase,
  UpdateUserProfile,
} from "../../../domain/use-cases/user";
import { created, forbidden, serverError } from "../helpers";
import { CommandController } from "../ports/command-controller";

export class UpdateUserProfileController extends CommandController<
  UpdateUserProfileController.Request,
  HttpResponse
> {
  private updateUser: UpdateUserProfile;

  constructor(updateUser: UpdateUserProfile, userLogs: RegisterUserLogs) {
    super(userLogs);
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

      await this.userLogs.log(request.accountId, this.updateUser);

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
