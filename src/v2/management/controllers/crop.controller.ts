import {
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { HTTPIncomingAdapters } from "../../../shared/ports/incoming-adapters";
import { ManagementCropUseCases } from "../services/crop";

export class ManagementCropControllers {
  static async createCrop(params: {
    Name: string;
    LocationName: string | null;
    CreatedAt?: string;
    UpdatedAt?: string;
  }): Promise<HttpResponse> {
    try {
      const createdOrError = await ManagementCropUseCases.createCrop({
        Name: params.Name,
        LocationName: params.LocationName,
      });

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

  static async deleteCrop(
    params: HTTPIncomingAdapters.ItemIdInput & HTTPIncomingAdapters.UserIdInput
  ): Promise<HttpResponse> {
    try {
      const deletedOrError = await ManagementCropUseCases.deleteCrop(params.id);

      if (deletedOrError.isLeft()) {
        return forbidden(deletedOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created("Sucesso ao deletar cultura");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getCropById(
    params: HTTPIncomingAdapters.ItemIdInput
  ): Promise<HttpResponse> {
    try {
      const result = await ManagementCropUseCases.getCropById(params.id);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getAllCrops(
    params: { name: string } | void
  ): Promise<HttpResponse> {
    try {
      const dto: { Name?: string } = {};

      if (params && params.name) {
        Object.assign(dto, {
          Name: params.name,
        });
      }
      const result = await ManagementCropUseCases.getAllCrops(dto);

      if (result.isLeft()) {
        return forbidden(result.value);
      }

      return ok(result.value);
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async updateCrop(
    params: {
      Name: string;
      LocationName: string | null;
    } & HTTPIncomingAdapters.ItemIdInput
  ): Promise<HttpResponse> {
    try {
      const updatedOrError = await ManagementCropUseCases.updateCrop({
        Id: Number(params.id),
        Name: params.Name,
        LocationName: params.LocationName,
      });

      if (updatedOrError.isLeft()) {
        return forbidden(updatedOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created("Sucesso ao atualizar cultura");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async createCropCycles(
    params: {
      data: Array<{
        Title: string;
        DurationInDays: number;
        Start: number;
        End: number;
        KC: number;
        Increment: number;
      }>;
    } & HTTPIncomingAdapters.ItemIdInput &
      HTTPIncomingAdapters.ItemIdInput
  ): Promise<HttpResponse> {
    try {
      const createdOrError = await ManagementCropUseCases.insertCropCycles(
        params.id,
        params.data
      );

      if (createdOrError.isLeft()) {
        return forbidden(createdOrError.value);
      }

      // await this.userLogs.log(request.accountId, this.useCase);

      return created("Sucesso ao criar cultura");
    } catch (error) {
      console.error(error);
      return serverError(error as Error);
    }
  }

  static async getAllCropCycles(
    params: HTTPIncomingAdapters.ItemIdInput
  ): Promise<HttpResponse> {
    try {
      const result = await ManagementCropUseCases.findCropCyclesByCropId(
        params.id
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
