import {
  LoginUserAccount,
  UserOperationControllerDTO,
} from "../../../@types/login-user";
import { HttpResponse } from "../../../shared/ports/http-response";
import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../shared/utils/http-responses";
import { ManagementCropCycle } from "../core/model/crop-cycles";

import { IManagementCropsServices } from "../services/protocols/management-crops";
import {
  createCropCycleValidator,
  createCropValidator,
  deleteCropValidator,
  getAllCropCropCyclesValidator,
  getAllCropsValidator,
  getCropByIdValidator,
  updateCropValidator
} from "./schema/crop";

type CreateCropRequest = {
  Name: string;
  IsPermanent: boolean;
  CycleRestartPoint: string;
  Cycles: Array<ManagementCropCycle>;
} & LoginUserAccount

type UpdateCropRequest = {
  id: number;
  Name: string;
  IsPermanent: boolean;
  CycleRestartPoint: string;
  Cycles: Array<ManagementCropCycle>;
} & UserOperationControllerDTO

export class ManagementCropControllers {
  constructor(private managementCropServices: IManagementCropsServices) { }

  async create(
    params: CreateCropRequest
  ): Promise<HttpResponse> {
    try {
      const { IsPermanent, CycleRestartPoint, Name, Cycles, accountId } = params;

      const { error } = await createCropValidator.validate({
        IsPermanent,
        CycleRestartPoint,
        Name,
        Cycles,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.managementCropServices.create(
        {
          data: {
            Name,
            CycleRestartPoint,
            IsPermanent,
            Cycles
          },
          audit: {
            author: accountId,
            operation: ''
          }
        }
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async update(
    params: UpdateCropRequest
  ): Promise<HttpResponse> {
    try {
      const { CycleRestartPoint, IsPermanent, Name, Cycles, Operation, accountId, id } =
        params;

      const { error } = await updateCropValidator.validate({
        id,
        accountId,
        Operation,
        CycleRestartPoint,
        IsPermanent,
        Name,
        Cycles
      });

      if (error) {
        return badRequest(error);
      }

      const updatedOrError = await this.managementCropServices.update(
        {
          data: {
            Id: Number(id),
            Name: Name,
            CycleRestartPoint,
            IsPermanent,
            Cycles
          },
          audit: {
            author: accountId,
            operation: Operation
          }
        }
      );

      if (updatedOrError.isLeft()) {
        return forbidden(updatedOrError.value);
      }

      return created("Sucesso ao atualizar cultura");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async deleteCrop(
    params: {
      id: number;
    } & UserOperationControllerDTO
  ): Promise<HttpResponse> {
    try {
      const { id, Operation, accountId } = params;

      const { error } = await deleteCropValidator.validate({
        id,
        Operation,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const deletedOrError = await this.managementCropServices.deleteCrop({
        data: {
          id
        },
        audit: {
          author: accountId,
          operation: Operation,
        }
      });

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      return created("Sucesso ao deletar cultura");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async getCropById(params: { id: number }): Promise<HttpResponse> {
    try {
      const { id } = params;
      const { error } = await getCropByIdValidator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.managementCropServices.getCropById(id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async getAllCrops(params: { name?: string }): Promise<HttpResponse> {
    try {
      const input = {};

      if (Reflect.has(params, "name")) {
        Object.assign(input, {
          name: params.name,
        });
      }

      const { error } = await getAllCropsValidator.validate(input);

      if (error) {
        return badRequest(error);
      }

      const dto: { Name?: string } = {};

      if (params && params.name) {
        Object.assign(dto, {
          Name: params.name,
        });
      }
      const result = await this.managementCropServices.getAllCrops(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async createCropCycles(
    params: {
      id: number;
      data: Array<{
        Title: string;
        Start: number;
        End: number;
        KC: number;
        Increment: number;
      }>;
    } & LoginUserAccount
  ): Promise<HttpResponse> {
    try {
      const { id, data, accountId } = params;

      const { error } = await createCropCycleValidator.validate({
        id,
        data,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.managementCropServices.insertCropCycles(
        {
          data: {
            id,
            cycles: data,
          },
          audit: {
            author: accountId,
            operation: ''
          }
        }
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return created("Sucesso ao criar cultura");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  async getAllCropCycles(params: { id: number }): Promise<HttpResponse> {
    try {
      const { id } = params;

      const { error } = await getAllCropCropCyclesValidator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await this.managementCropServices.findCropCyclesByCropId(
        id
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
}
