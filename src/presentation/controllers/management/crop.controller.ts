import { CropUseCases } from "../../../domain/use-cases/management";
import { ManagementCropDTO } from "../../../domain/use-cases/management/ports/crop/dto";
import { CropUseCaseProtocol } from "../../../domain/use-cases/management/ports/crop/use-case";
import { created, forbidden, ok, serverError } from "../helpers";

export class ManagementCropController {
  public _useCases: CropUseCases;

  constructor(cropUseCases: CropUseCases) {
    this._useCases = cropUseCases;
  }

  async create(params: ManagementCropDTO.Create.Input & { accountId: number }) {
    try {
      const dto: ManagementCropDTO.Create.Input = {
        cycles: params.cycles,
        name: params.name,
        locationName: params.locationName,
      };

      const createdOrError = await this._useCases.create(dto);

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

  async delete(params: { accountId: number; id: number }) {
    try {
      const dto: ManagementCropDTO.Delete.Input = {
        id: params.id,
      };

      const deletedOrError = await this._useCases.delete(dto);

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

  async getById(params: ManagementCropDTO.GetById.Input) {
    const result = await this._useCases.getById(params);

    return ok(result.value);
  }
  async getAll(params: ManagementCropDTO.GetById.Input) {
    const result = await this._useCases.getAll();

    return ok(result.value);
  }

  async update(
    params: ManagementCropDTO.Update.Input & { accountId: number; id: number }
  ) {
    try {
      const dto: ManagementCropDTO.Update.Input = {
        id: params.id,
        cycles: params.cycles,
        name: params.name,
        locationName: params.locationName,
      };

      const updatedOrError = await this._useCases.update(dto);

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
