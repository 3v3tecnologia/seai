import {
  LoginUserAccount,
  UserOperationControllerDTO,
} from "../../../../@types/login-user";
import { HttpResponse } from "../../../../shared/ports/http-response";
import {
  badRequest,
  created,
  serverError,
  forbidden,
  noContent,
  ok,
} from "../../../../shared/utils/http-responses";
import {
  IPaginationInput,
  parsePaginationInput,
} from "../../../../shared/utils/pagination";
import { UserType, UserTypes } from "../model/user";
import {
  Modules,
  SystemModulesPermissions,
} from "../model/user-modules-access";
import { IUserService } from "../services/user.service.procotol";
import {
  createUserValidator,
  deleteUserValidator,
  loginValidator,
  updateUserValidator,
} from "./schema";

export class GovernmentUserController {
  constructor(private userService: IUserService) {
    this.userService = userService;
  }

  async create(
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

      const createdOrError = await this.userService.create(
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
      const result = await this.userService.login(request);

      if (result.isLeft()) {
        return forbidden(result.value);
      }
      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async completeRegister(request: {
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

      const updateOrError = await this.userService.completeRegister(dto);

      if (updateOrError.isLeft()) {
        return forbidden(updateOrError.value);
      }

      return created(updateOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async forgotPassword(request: { email: string }): Promise<HttpResponse> {
    try {
      const { email } = request;

      const result = await this.userService.forgotPassword(email);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return created(result.value);
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

  async updateProfile(request: {
    accountId: number;
    email?: string;
    login: string;
    name: string;
  }): Promise<HttpResponse> {
    try {
      const { accountId, login, name, email } = request;

      const result = await this.userService.updateProfile({
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
  async deleteUser(
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

      const { error } = await deleteUserValidator.validate({
        ...dto,
        Operation: request.Operation,
        accountId: request.accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.userService.deleteUser(dto, {
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

  async getUsers(
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

      const result = await this.userService.getUsers({
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

  async getUserById(request: {
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

      const result = await this.userService.getUserById(
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

  async getUser(
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
        const result = await this.userService.getUsers({
          id: id || accountId,
        });

        return ok(result.value);
      }

      const result = await this.userService.getUsers({
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

  async updateUser(
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

      const { error } = await updateUserValidator.validate({
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

      const updateOrError = await this.userService.updateUser(
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

  async getProfile(request: { accountId: number }): Promise<HttpResponse> {
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

  async getSystemModules(): Promise<HttpResponse> {
    try {
      const result = await this.userService.getSystemModules();

      return ok(result);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
