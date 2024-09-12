import {
  LoginUserAccount,
  UserOperationControllerDTO,
} from "../../../@types/login-user";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  noContent,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../shared/utils/pagination";
import { deleteUserIrrigationValidator, updateUserIrrigationValidator } from "../../Irrigation/controllers/schema/user-irrigation";
import { UserType, UserTypes } from "../core/model/gov-user";
import {
  Modules,
  SystemModulesPermissions,
} from "../core/model/user-modules-access";
import { govUserService } from "../services/factories/gov-user";
import { loginValidator } from "./schema/gov-user";
import { createUserValidator } from "./schema/irrigant";


export class GovernmentUserController {

  static async create(
    request: {
      email: string;
      type: UserType;
      modules: {
        [Modules.USER]: Required<SystemModulesPermissions>;
        [Modules.EQUIPMENTS]: Required<SystemModulesPermissions>;
        [Modules.CROP]: Required<SystemModulesPermissions>;
        [Modules.FAQ]: Required<SystemModulesPermissions>;
        [Modules.NEWSLETTER]: Required<SystemModulesPermissions>;
        [Modules.STUDIES]: Required<SystemModulesPermissions>;
        [Modules.WEIGHTS]: Required<SystemModulesPermissions>;
      };
    } & LoginUserAccount
  ): Promise<HttpResponse> {
    try {
      const { email, modules, type, accountId } = request;

      const { error } = await createUserValidator.validate({
        email,
        modules,
        type,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await govUserService.create(
        {
          email,
          modules,
          type,
        },
        request.accountId
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created(createdOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async login(request: {
    login: string;
    password: string;
  }): Promise<HttpResponse> {
    try {
      const { login, password } = request;

      const { error } = await loginValidator.validate({
        login,
        password,
      });

      if (error) {
        return badRequest(error);
      }
      const result = await govUserService.login(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async completeRegister(request: {
    code: string;
    name: string;
    login: string;
    password: string;
    confirmPassword: string;
  }): Promise<HttpResponse> {
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

      const updateOrError = await govUserService.completeRegister(dto);

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async forgotPassword(request: { email: string }): Promise<HttpResponse> {
    try {
      const { email } = request;

      const result = await govUserService.forgotPassword(email);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return created(result.value);
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

      const result = await govUserService.resetPassword({
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
  }): Promise<HttpResponse> {
    try {
      const { accountId, login, name, email } = request;

      const result = await govUserService.updateProfile({
        id: accountId,
        login,
        name,
        email,
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

  static async deleteUser(
    request: {
      id: number;
      email?: string;
    } & UserOperationControllerDTO
  ): Promise<HttpResponse> {
    try {
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

      const { error } = await deleteUserIrrigationValidator.validate({
        ...dto,
        Operation: request.Operation,
        accountId: request.accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await govUserService.deleteUser(dto, {
        author: request.accountId,
        operation: request.Operation,
      });

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return noContent();
    } catch (error) {
      return serverError(error as Error);
    }
  }

  static async getUsers(
    request: {
      name?: string;
      type?: Record<UserTypes, string>;
    } & Partial<IPaginationInput>
  ): Promise<HttpResponse> {
    try {
      const { limit, name, offset, pageNumber, type } = request;

      // const { error } = await this.validator.validate({
      //   limit,
      //   name,
      //   offset,
      //   pageNumber,
      //   type,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      const result = await govUserService.getUsers({
        name: name,
        type: type,
        ...parsePaginationInput({
          page: pageNumber,
          limit: limit,
        }),
      });

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getUserById(request: {
    accountId: number;
    id: number;
  }): Promise<HttpResponse> {
    try {
      const { accountId, id } = request;

      // const { error } = await this.validator.validate({
      //   accountId,
      //   id,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      const result = await govUserService.getUserById(
        request.id || request.accountId
      );

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getUser(
    request: {
      id?: number;
      accountId?: number;
      name?: string;
      type?: Record<UserTypes, string>;
    } & Partial<IPaginationInput>
  ): Promise<HttpResponse> {
    try {
      const { accountId, id, limit, name, offset, pageNumber, type } = request;

      // const { error } = await this.validator.validate({
      //   accountId,
      //   id,
      //   limit,
      //   name,
      //   offset,
      //   pageNumber,
      //   type,
      // });

      // if (error) {
      //   return badRequest(error);
      // }

      if (id || accountId) {
        const result = await govUserService.getUsers({
          id: id || accountId,
        });

        return ok(result.value);
      }

      const result = await govUserService.getUsers({
        name,
        type,
        ...parsePaginationInput({
          page: pageNumber,
          limit: limit,
        }),
      });

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async updateUser(
    request: {
      id: number;
      email: string;
      name: string;
      login: string;
      type: UserType;
      modules: {
        [Modules.USER]: Required<SystemModulesPermissions>;
        [Modules.EQUIPMENTS]: Required<SystemModulesPermissions>;
        [Modules.CROP]: Required<SystemModulesPermissions>;
        [Modules.FAQ]: Required<SystemModulesPermissions>;
        [Modules.NEWSLETTER]: Required<SystemModulesPermissions>;
        [Modules.STUDIES]: Required<SystemModulesPermissions>;
        [Modules.WEIGHTS]: Required<SystemModulesPermissions>;
      };
    } & UserOperationControllerDTO
  ): Promise<HttpResponse> {
    try {
      const { id, email, login, name, modules, type, Operation, accountId } =
        request;

      const { error } = await updateUserIrrigationValidator.validate({
        id,
        email,
        modules,
        type,
        name,
        login,
        accountId,
        Operation,
      });

      if (error) {
        return badRequest(error);
      }

      const updateOrError = await govUserService.updateUser(
        {
          id: Number(id),
          email,
          modules,
          type,
          name,
          login,
        },
        {
          author: accountId,
          operation: Operation,
        }
      );

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getProfile(request: { accountId: number }): Promise<HttpResponse> {
    try {
      const { accountId } = request;

      const result = await govUserService.getProfile(accountId);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getSystemModules(): Promise<HttpResponse> {
    try {
      const result = await govUserService.getSystemModules();

      return ok(result);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
