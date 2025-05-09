import { Either, left, right } from "../../../shared/Either";
import { ManagementCropErrors } from "../../Crop/core/crop-errors";
import { IManagementCropsRepository } from "../../Crop/infra/repository/protocol/management-crop.repository";
import {
  IrrigationSystemProps,
  IrrigationSystemTypes,
  makeIrrigationSystem
} from "../core/model/irrigation-system";
import { IUserIrrigationPreferencesRepository } from "../infra/repository/protocols/irrigation.repository";


import { SaveUserIrrigationPreferencesInput, UpdateUserIrrigationPreferencesInput } from "./dto/user-irrigation";
import { IUserIrrigationPreferencesServices } from "./protocols/user-irrigation-preferences";

export class UserIrrigationPreferencesServices
  implements IUserIrrigationPreferencesServices {
  constructor(private irrigationCropsRepository: IUserIrrigationPreferencesRepository, private cropsRepository: IManagementCropsRepository) { }

  async saveIrrigationCrops(
    dto: SaveUserIrrigationPreferencesInput
  ): Promise<Either<Error, number>> {
    const cropAlreadyExists = await this.cropsRepository.idExists(dto.CropId)

    if (cropAlreadyExists === false) {
      return left(new ManagementCropErrors.CropNotExistsError())
    }

    const userIrrigationAlreadyExists =
      await this.irrigationCropsRepository.getUserIrrigationByName(
        dto.Name,
        dto.UserId
      );

    if (!!userIrrigationAlreadyExists) {
      return left(
        new Error("Não é possível cadastrar irrigação com nome já existente.")
      );
    }

    // Save Irrigation Crops
    const systemMeasurementsOrError = makeIrrigationSystem(
      dto.System
    );

    if (systemMeasurementsOrError.isLeft()) {
      return left(systemMeasurementsOrError.value);
    }

    const systemMeasurements = (systemMeasurementsOrError.value as any) as IrrigationSystemProps


    const id = await this.irrigationCropsRepository.save({
      user_id: dto.UserId,
      name: dto.Name,
      crop_id: dto.CropId,
      planting_date: dto.PlantingDate,
      system_type: dto.System.Type as IrrigationSystemTypes,
      area: systemMeasurements?.Area,
      // effective_area: systemMeasurements?.EfectiveArea || null,
      time: systemMeasurements?.Time,
      flow: systemMeasurements?.Flow,
      length: systemMeasurements?.Length,
      quantity: systemMeasurements?.Quantity,
      spacing: systemMeasurements?.Spacing,
      sprinkler_precipitation: systemMeasurements?.Precipitation,
    });

    if (id) {
      return right(id);
    }

    return left(new Error("Não foi possível cadastrar sistema de irrigação."));
  }

  async updateIrrigationCropsById(
    dto: UpdateUserIrrigationPreferencesInput
  ): Promise<Either<Error, string>> {
    const cropAlreadyExists = await this.cropsRepository.idExists(dto.CropId)

    if (cropAlreadyExists === false) {
      return left(new ManagementCropErrors.CropNotExistsError())
    }

    const userIrrigationAlreadyExists =
      await this.irrigationCropsRepository.getUserIrrigationCropsById(
        dto.Id,
        dto.UserId
      );

    if (userIrrigationAlreadyExists == null) {
      return left(new Error("Irrigação não encontrada"));
    }


    // Save Irrigation Crops
    const systemMeasurementsOrError = makeIrrigationSystem(
      dto.System
    );

    if (systemMeasurementsOrError.isLeft()) {
      return left(systemMeasurementsOrError.value);
    }

    const systemMeasurements = (systemMeasurementsOrError.value as any) as IrrigationSystemProps

    const currentDate = toISOstringShortDate(new Date());
    const createdAt = toISOstringShortDate(
      new Date(userIrrigationAlreadyExists?.created_at)
    );

    const toPersist = {
      id: dto.Id,
      user_id: dto.UserId,
      name: dto.Name,
      crop_id: dto.CropId,
      planting_date: dto.PlantingDate,
      system_type: dto.System.Type as IrrigationSystemTypes,
      area: systemMeasurements?.Area,
      // effective_area: systemMeasurements?.EfectiveArea,
      flow: systemMeasurements?.Flow,
      time: systemMeasurements?.Time,
      length: systemMeasurements?.Length,
      quantity: systemMeasurements?.Quantity,
      spacing: systemMeasurements?.Spacing,
      sprinkler_precipitation: systemMeasurements?.Precipitation,
    }

    // Se editar um setor  no mesmo dia que foi criado (created_At) então é para deixar editar os valores  da linha da tabela irrigation_crops
    if (createdAt == currentDate) {
      await this.irrigationCropsRepository.update(toPersist);
    } else {
      // Se editar um setor depois de 1 dia criado então só colocar  updated_at no relação e criar uma nova linha na irrigation_crops
      // e na relação também;
      await this.irrigationCropsRepository.updateUserIrrigationById(
        dto.Id,
        dto.UserId
      );

      await this.irrigationCropsRepository.save(toPersist);
    }

    return right("Atualizado com sucesso");
  }

  async deleteIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, void>> {
    const data =
      await this.irrigationCropsRepository.getUserIrrigationCropsById(
        id,
        user_id
      );

    // Se criar um setor e tentar apagar no mesmo dia então é para deixar apagar a linha da relação  e da irrigation_crops;
    if (
      data &&
      toISOstringShortDate(new Date(data.created_at)) ===
      toISOstringShortDate(new Date())
    ) {
      await this.irrigationCropsRepository.deleteById(id, user_id);
      return right();
    }

    // Se criar um setor e tentar apagar um setor depois de 1 dia de criado então só colocar  updated_at no relação
    await this.irrigationCropsRepository.updateUserIrrigationById(id, user_id);

    return right();
  }

  async deleteAllIrrigationCrops(
    user_id: number
  ): Promise<Either<Error, void>> {
    return right(await this.irrigationCropsRepository.deleteByUserId(user_id));
  }

  async getIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>> {
    const irrigationCrops = await this.irrigationCropsRepository.getById(
      id,
      user_id
    );

    if (irrigationCrops) {
      const {
        System,
        CropId,
        Crop,
        PlantingDate,
        Pluviometer,
        Station,
        Name,
        Id,
      } = irrigationCrops;

      return right({
        Id,
        Name,
        System,
        CropId,
        Crop,
        PlantingDate,
        Pluviometer,
        Station,
      });
    }

    return right(null);
  }

  async getAllIrrigationCrops(user_id: number): Promise<Either<Error, any>> {
    const result = await this.irrigationCropsRepository.getByUserId(user_id);

    if (result) {
      return right(
        result.map((data) => {
          const {
            System,
            CropId,
            Crop,
            PlantingDate,
            Pluviometer,
            Station,
            Name,
            Id,
          } = data;

          return {
            Id,
            Name,
            System,
            CropId,
            Crop,
            PlantingDate,
            Pluviometer,
            Station,
          };
        })
      );
    }

    return right(null);
  }
}

function toISOstringShortDate(data: Date) {
  return data.toISOString().split("T")[0];
}
