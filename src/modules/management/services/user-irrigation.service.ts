import { Either, left, right } from "../../../shared/Either";
import {
  IrrigationSystemTypes,
  makeSystemIrrigationMeasurements,
} from "../core/model/irrigation-system";

import { IIrrigationSystemMeasurementsEntity } from "../core/model/irrigation-system-measurements";
import { IIrrigationRepository } from "../repositories/protocols/irrigation.repository";
import {
  ISaveIrrigationRecommendationDTO,
  IUpdateIrrigationRecommendationDTO,
} from "./dto/irrigation";
import { IUserIrrigationCropsServices } from "./protocols/user-irrigation";

export class UserIrrigationCropsServices
  implements IUserIrrigationCropsServices
{
  constructor(private irrigationCropsRepository: IIrrigationRepository) {}

  async saveIrrigationCrops(
    dto: ISaveIrrigationRecommendationDTO
  ): Promise<Either<Error, number>> {
    // Save Irrigation Crops
    const systemMeasurementsOrError = makeSystemIrrigationMeasurements(
      dto.System
    );

    if (systemMeasurementsOrError.isLeft()) {
      return left(systemMeasurementsOrError.value);
    }

    const systemMeasurements = (
      systemMeasurementsOrError.value as IIrrigationSystemMeasurementsEntity
    ).getAllMeasurement();

    const id = await this.irrigationCropsRepository.save({
      user_id: dto.UserId,
      crop_id: dto.CropId,
      planting_date: dto.PlantingDate,
      system_type: dto.System.Type as IrrigationSystemTypes,
      area: systemMeasurements?.Area,
      effective_area: systemMeasurements?.EfectiveArea,
      flow: systemMeasurements?.Flow,
      length: systemMeasurements?.Length,
      plants_qtd: systemMeasurements?.PlantsQtd,
      spacing: systemMeasurements?.Spacing,
      sprinkler_precipitation: systemMeasurements?.Precipitation,
    });

    if (id) {
      return right(id);
    }

    return left(new Error("Não foi possível cadastrar sistema de irrigação."));
  }

  async updateIrrigationCropsById(
    dto: IUpdateIrrigationRecommendationDTO
  ): Promise<Either<Error, string>> {
    // Save Irrigation Crops
    const systemMeasurementsOrError = makeSystemIrrigationMeasurements(
      dto.System
    );

    if (systemMeasurementsOrError.isLeft()) {
      return left(systemMeasurementsOrError.value);
    }

    const systemMeasurements = (
      systemMeasurementsOrError.value as IIrrigationSystemMeasurementsEntity
    ).getAllMeasurement();

    await this.irrigationCropsRepository.update({
      id: dto.Id,
      user_id: dto.UserId,
      crop_id: dto.CropId,
      planting_date: dto.PlantingDate,
      system_type: dto.System.Type as IrrigationSystemTypes,
      area: systemMeasurements?.Area,
      effective_area: systemMeasurements?.EfectiveArea,
      flow: systemMeasurements?.Flow,
      length: systemMeasurements?.Length,
      plants_qtd: systemMeasurements?.PlantsQtd,
      spacing: systemMeasurements?.Spacing,
      sprinkler_precipitation: systemMeasurements?.Precipitation,
    });

    return right("Atualizado com sucesso");
  }

  async deleteIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, void>> {
    return right(await this.irrigationCropsRepository.deleteById(id, user_id));
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
    return right(await this.irrigationCropsRepository.getById(id, user_id));
  }

  async getAllIrrigationCrops(user_id: number): Promise<Either<Error, any>> {
    return right(await this.irrigationCropsRepository.getByUserId(user_id));
  }
}
