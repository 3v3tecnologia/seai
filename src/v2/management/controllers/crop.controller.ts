import {
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ManagementCropDTO } from "../ports/crop/dto";
import { ManagementCropUseCases } from "../services/crop";

export class ManagementCropControllers {
  static async create(
    params: ManagementCropDTO.Create.Input & { accountId: number }
  ): Promise<HttpResponse> {
    try {
      const dto: ManagementCropDTO.Create.Input = {
        Cycles: params.Cycles,
        Name: params.Name,
        LocationName: params.LocationName,
      };

      const createdOrError = await ManagementCropUseCases.create(dto);

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

  static async delete(params: {
    accountId: number;
    id: number;
  }): Promise<HttpResponse> {
    try {
      const dto: ManagementCropDTO.Delete.Input = {
        id: params.id,
      };

      const deletedOrError = await ManagementCropUseCases.delete(dto);

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created(deletedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getCropById(
    params: ManagementCropDTO.GetCrop.Input
  ): Promise<HttpResponse> {
    const result = await ManagementCropUseCases.getCropById(params);

    return ok(result.value);
  }

  static async getAll(params: { name: string } | void): Promise<HttpResponse> {
    const result = await ManagementCropUseCases.getAll(params);

    return ok(result.value);
  }

  static async update(
    params: ManagementCropDTO.Update.Input & { accountId: number; id: number }
  ): Promise<HttpResponse> {
    try {
      const dto: ManagementCropDTO.Update.Input = {
        Id: params.id,
        Cycles: params.Cycles,
        Name: params.Name,
        LocationName: params.LocationName,
      };

      const updatedOrError = await ManagementCropUseCases.update(dto);

      if (updatedOrError.isLeft()) {
        return forbidden(updatedOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created(updatedOrError.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }
}
