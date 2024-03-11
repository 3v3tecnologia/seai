import {
  created,
  forbidden,
  serverError,
  ok,
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
        cycles: params.cycles,
        name: params.name,
        locationName: params.locationName,
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

  static async getById(
    params: ManagementCropDTO.GetById.Input
  ): Promise<HttpResponse> {
    const result = await ManagementCropUseCases.getById(params);

    return ok(result.value);
  }

  static async getAll(
    params: ManagementCropDTO.GetById.Input
  ): Promise<HttpResponse> {
    const result = await ManagementCropUseCases.getAll();

    return ok(result.value);
  }

  static async update(
    params: ManagementCropDTO.Update.Input & { accountId: number; id: number }
  ): Promise<HttpResponse> {
    try {
      const dto: ManagementCropDTO.Update.Input = {
        id: params.id,
        cycles: params.cycles,
        name: params.name,
        locationName: params.locationName,
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
