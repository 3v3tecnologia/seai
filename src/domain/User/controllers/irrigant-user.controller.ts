import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  forbidden,
  noContent,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { irrigantUserAccountService } from "../services/factories/irrigation-user";
import { IrrigantSignUpRequest } from "./requests/irrigant";
import { createUserValidator, loginValidator } from "./schema/irrigant";

export class IrrigantUserController {

  static async create(request: IrrigantSignUpRequest): Promise<HttpResponse> {
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

      const result = await irrigantUserAccountService.create(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async login(request: {
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
      const result = await irrigantUserAccountService.login(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async completeRegister(request: { code: string }): Promise<HttpResponse> {
    try {
      const { code } = request;

      const result = await irrigantUserAccountService.completeRegister(code);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async forgotPassword(request: { email: string }): Promise<HttpResponse> {
    try {
      const { email } = request;

      const result = await this.userService.forgotPassword(email);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async resetPassword(request: {
    code: string;
    password: string;
    confirmPassword: string;
  }): Promise<HttpResponse> {
    try {
      const { code, password, confirmPassword } = request;

      const result = await this.userService.resetPassword({
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

  static async updateProfile(request: {
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

      const result = await this.userService.updateProfile({
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

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async deleteAccount(request: { id: number }): Promise<HttpResponse> {
    try {
      const { id } = request;

      const result = await this.userService.deleteAccount(id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return noContent();
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getProfile(request: { accountId: number }): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      const result = await this.userService.getProfile(accountId);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
