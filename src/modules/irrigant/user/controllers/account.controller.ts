import { HttpResponse } from "../../../../presentation/controllers/ports";

import {
  badRequest,
  forbidden,
  noContent,
  ok,
  serverError,
} from "../../../../presentation/controllers/helpers";
import { IrrigantSignUpRequest } from "./requests/account";
import { IUserIrrigantServices } from "../services/protocols/account";
import { createUserValidator, loginValidator } from "./schema/account";

export class IrrigantAccountControllers {
  private services: IUserIrrigantServices;

  constructor(services: IUserIrrigantServices) {
    this.services = services;
  }

  async create(request: IrrigantSignUpRequest): Promise<HttpResponse> {
    try {
      const { email, login, name, confirmPassword, password } = request;

      const { error } = await createUserValidator.validate({
        email,
        login,
        name,
        confirmPassword,
        password,
      });

      if (error) {
        return badRequest(error);
      }

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
      const { login, email, password } = request;

      const { error } = await loginValidator.validate({
        login,
        email,
        password,
      });

      if (error) {
        return badRequest(error);
      }
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

  async completeRegister(request: { code: string }): Promise<HttpResponse> {
    try {
      const { code } = request;

      const result = await this.services.completeRegister(code);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async forgotPassword(request: { email: string }): Promise<HttpResponse> {
    try {
      const { email } = request;

      const result = await this.services.forgotPassword(email);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async resetPassword(request: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<HttpResponse> {
    try {
      const { code, password, confirmPassword } = request;

      const result = await this.services.resetPassword({
        code,
        password,
        confirmPassword,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async updateProfile(request: {
    accountId: number;
    email?: string;
    login: string;
    name: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<HttpResponse> {
    try {
      const { accountId, login, name, confirmPassword, email, password } =
        request;

      const result = await this.services.updateProfile({
        id: accountId,
        login,
        name,
        email,
        confirmPassword,
        password,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async deleteAccount(request: { id: number }): Promise<HttpResponse> {
    try {
      const { id } = request;

      const result = await this.services.deleteAccount(id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
