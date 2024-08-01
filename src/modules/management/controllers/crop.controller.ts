import {
  LoginUserAccount,
  UserOperationControllerDTO,
} from "../../../@types/login-user";
import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { UserCommandOperationProps } from "../../UserOperations/protocols/logger";
import { IManagementCropsServices } from "../services/protocols/management-crops";
import {
  createCropCycleValidator,
  createCropValidator,
  deleteCropValidator,
  getAllCropCropCyclesValidator,
  getAllCropsValidator,
  getCropByIdValidator,
  updateCropValidator,
} from "./schema/crop";

export class ManagementCropControllers {
  constructor(private managementCropServices: IManagementCropsServices) {}

  async createCrop(
    params: {
      Name: string;
      LocationName: string | null;
    } & LoginUserAccount
  ): Promise<HttpResponse> {
    try {
      const { LocationName, Name, accountId } = params;

      const { error } = await createCropValidator.validate({
        LocationName,
        Name,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const createdOrError = await this.managementCropServices.createCrop(
        {
          Name,
          LocationName,
        },
        params.accountId
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created(createdOrError.value);
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

      const deletedOrError = await this.managementCropServices.deleteCrop(id, {
        author: accountId,
        operation: Operation,
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

  async updateCrop(
    params: {
      id: number;
      Name: string;
      LocationName: string | null;
    } & UserOperationControllerDTO
  ): Promise<HttpResponse> {
    try {
      const { LocationName, Name, id, Operation, accountId } = params;

      const { error } = await updateCropValidator.validate({
        LocationName,
        Name,
        id,
        Operation,
        accountId,
      });

      if (error) {
        return badRequest(error);
      }

      const updatedOrError = await this.managementCropServices.updateCrop(
        {
          Id: Number(id),
          Name: Name,
          LocationName: LocationName,
        },
        {
          author: accountId,
          operation: Operation,
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

  async createCropCycles(
    params: {
      id: number;
      data: Array<{
        Title: string;
        // DurationInDays: number;
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
          idCrop: id,
          cycles: data,
        },
        params.accountId
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
