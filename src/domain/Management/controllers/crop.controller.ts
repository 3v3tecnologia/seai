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
import { ManagementCropCycle } from "../core/model/crop-cycles";

import { IManagementCropsServices } from "../services/protocols/management-crops";
import {
  createCropCycleValidator,
  createCropValidator,
  deleteCropValidator,
  getAllCropCropCyclesValidator,
  getAllCropsValidator,
  getCropByIdValidator,
  setCycleRestartPointValidator,
  updateCropValidator
} from "./schema/crop";

type CreateCropRequest = {
  Name: string;
  IsPermanent: boolean;
  CycleRestartPoint: string;
  Cycles: Array<ManagementCropCycle>;
} & LoginUserAccount

type SetRestartCyclePointRequest = {
  id: number;
  CycleRestartPoint: number;
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
      const { IsPermanent, Name, Cycles, accountId } = params;

      const { error } = await createCropValidator.validate({
        IsPermanent,
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


      return created(createdOrError.value);
    } catch (error) {
      return serverError(error as Error);
    }
  }

  async update(
    params: UpdateCropRequest
  ): Promise<HttpResponse> {
    try {
      const { IsPermanent, Name, Cycles, Operation, accountId, id } =
        params;

      const { error } = await updateCropValidator.validate({
        id,
        accountId,
        Operation,
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

  async setCropCycleRestartPoint(
    params: SetRestartCyclePointRequest
  ): Promise<HttpResponse> {
    try {
      const { id, CycleRestartPoint, accountId } = params;

      const { error } = await setCycleRestartPointValidator.validate({
        id,
        CycleRestartPoint,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.managementCropServices.setRestartCyclePoint(id, CycleRestartPoint);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return noContent()
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
