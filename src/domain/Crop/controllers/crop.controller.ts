import { LoginUserAccount, UserOperationControllerDTO } from "../../../@types/login-user";
import { HttpResponse } from "../../../shared/ports/http-response";
import { badRequest, created, forbidden, noContent, ok, serverError } from "../../../shared/utils/http-responses";
import { ManagementCropCycle } from "../core/model/crop-cycles";
import { managementCropsServices } from "../services/factory";
import { createCropValidator, deleteCropValidator, getAllCropCropCyclesValidator, getAllCropsValidator, getCropByIdValidator, setCycleRestartPointValidator, updateCropValidator } from "./schema/crop";

type CreateCropRequest = {
  Name: string;
  IsPermanent: boolean;
  CycleRestartPoint: number;
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
  CycleRestartPoint: number;
  Cycles: Array<ManagementCropCycle>;
} & UserOperationControllerDTO

export class ManagementCropController {

  static async create(
    params: CreateCropRequest
  ): Promise<HttpResponse> {
    try {
      const { IsPermanent, Name, Cycles, CycleRestartPoint, accountId } = params;



      const { error } = await createCropValidator.validate({
        IsPermanent,
        Name,
        Cycles,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await managementCropsServices.create(
        {
          data: {
            Name,
            IsPermanent,
            Cycles,
            CycleRestartPoint
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

  static async update(
    params: UpdateCropRequest
  ): Promise<HttpResponse> {
    try {
      const { IsPermanent, Name, Cycles, Operation, CycleRestartPoint, accountId, id } =
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

      const updatedOrError = await managementCropsServices.update(
        {
          data: {
            Id: Number(id),
            Name: Name,
            IsPermanent,
            Cycles,
            CycleRestartPoint
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

  static async deleteCrop(
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

      const deletedOrError = await managementCropsServices.deleteCrop({
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

  static async getCropById(params: { id: number }): Promise<HttpResponse> {
    try {
      const { id } = params;
      const { error } = await getCropByIdValidator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await managementCropsServices.getCropById(id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getAllCrops(params: { name?: string }): Promise<HttpResponse> {
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
      const result = await managementCropsServices.getAllCrops(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async setCropCycleRestartPoint(
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

      const createdOrError = await managementCropsServices.setRestartCyclePoint(id, CycleRestartPoint);

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      return noContent()
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getAllCropCycles(params: { id: number }): Promise<HttpResponse> {
    try {
      const { id } = params;

      const { error } = await getAllCropCropCyclesValidator.validate({
        id,
      });

      if (error) {
        return badRequest(error);
      }

      const result = await managementCropsServices.findCropCyclesByCropId(
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
