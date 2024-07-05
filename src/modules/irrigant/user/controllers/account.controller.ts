import { HttpResponse } from "../../../../presentation/controllers/ports";

import {
  forbidden,
  ok,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { IUserIrrigantServices } from "../services/account";
import { IrrigantSignUpRequest } from "./requests/account";

export class IrrigantAccountControllers {
  private services: IUserIrrigantServices;

  constructor(services: IUserIrrigantServices) {
    this.services = services;
  }

  async create(request: IrrigantSignUpRequest): Promise<HttpResponse> {
    try {
      const result = await this.services.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      // await this.userLogs.log(request.accountId, this.signUp.useCaseLogs());
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async login(request: {
    login?: string;
    email?: string;
    password: string;
  }): Promise<HttpResponse> {
    try {
      const result = await this.services.login(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      // await this.userLogs.log(request.accountId, this.signUp.useCaseLogs());
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  completeRegister(user: any): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }

  resetPassword(user: any): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
}
