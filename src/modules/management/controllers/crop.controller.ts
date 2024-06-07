import {
  badRequest,
  created,
  forbidden,
  ok,
  serverError,
} from "../../../presentation/controllers/helpers";
import { HttpResponse } from "../../../presentation/controllers/ports";
import { ManagementCropUseCases } from "../services/crop";
import { createCropCycleValidator, createCropValidator, deleteCropValidator, getAllCropCropCyclesValidator, getAllCropsValidator, getCropByIdValidator, updateCropValidator } from "./schema/crop";

export class ManagementCropControllers {
  static async createCrop(params: {
    Name: string;
    LocationName: string | null;
  }): Promise<HttpResponse> {
    try {
      const { LocationName, Name } = params

      const { error } = await createCropValidator.validate({ LocationName, Name });


      if (error) {
        return badRequest(error)
      }

      const createdOrError = await ManagementCropUseCases.createCrop({
        Name,
        LocationName,
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
    params: { id: number }
  ): Promise<HttpResponse> {
    try {
      const {
        id
      } = params

      const { error } = await deleteCropValidator.validate({
        id
      })

      if (error) {
        return badRequest(error)
      }

      const deletedOrError = await ManagementCropUseCases.deleteCrop(id);

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
    params: { id: number }
  ): Promise<HttpResponse> {
    try {
      const { id } = params
      const { error } = await getCropByIdValidator.validate({
        id
      });

      if (error) {
        return badRequest(error)
      }

      const result = await ManagementCropUseCases.getCropById(id);

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
    params: { name?: string }
  ): Promise<HttpResponse> {
    try {
      const input = {}

      if (Reflect.has(params, 'name')) {
        Object.assign(input, {
          name: params.name
        })


      }

      const { error } = await getAllCropsValidator.validate(input);

      if (error) {
        return badRequest(error)
      }

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
      id: number;
      Name: string;
      LocationName: string | null;
    }
  ): Promise<HttpResponse> {
    try {
      const {
        LocationName,
        Name,
        id
      } = params

      const { error } = await updateCropValidator.validate({
        LocationName,
        Name,
        id
      })

      if (error) {
        return badRequest(error)
      }

      const updatedOrError = await ManagementCropUseCases.updateCrop({
        Id: Number(id),
        Name: Name,
        LocationName: LocationName,
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
      id: number;
      data: Array<{
        Title: string;
        // DurationInDays: number;
        Start: number;
        End: number;
        KC: number;
        Increment: number;
      }>;
    }
  ): Promise<HttpResponse> {
    try {
      const {
        id,
        data
      } = params

      const { error } = await createCropCycleValidator.validate({
        id,
        data
      });

      if (error) {
        return badRequest(error)
      }

      const createdOrError = await ManagementCropUseCases.insertCropCycles(
        id,
        data
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
    params: { id: number }
  ): Promise<HttpResponse> {
    try {
      const {
        id
      } = params

      const { error } = await getAllCropCropCyclesValidator.validate({
        id
      });

      if (error) {
        return badRequest(error)
      }

      const result = await ManagementCropUseCases.findCropCyclesByCropId(
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
