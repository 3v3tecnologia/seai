import { Either, left, right } from "../../../shared/Either";
import { getYesterDayDate } from "../../../shared/utils/date";
import { DecimalFormatter } from "../../../shared/utils/decimal-formatter";
import { BladeSuggestion } from "../core/model/blade-suggestion";
import {
  IrrigationSystemEntity,
  IrrigationSystemTypes,
  makeIrrigationSystem,
  makeSystemIrrigationMeasurements,
} from "../core/model/irrigation-system";

import { ManagementCropErrors } from "../core/errors/crop-errors";

import { Logger } from "../../../shared/logger/logger";
import { DbEquipmentsMeasurementsRepository } from "../../equipments/repositories/equipments-measurements.repository";
import { IrrigantErrors } from "../core/errors/irrigant.error";
import { getCropDate } from "../core/model/crop";
import { ManagementCropCycle, findKc } from "../core/model/crop-cycles";
import { IIrrigationSystemMeasurementsEntity } from "../core/model/irrigation-system-measurements";
import { DbManagementCropRepository } from "../repositories/crop.repository";
import { IrrigationCropsRepository } from "../repositories/irrigation.repository";
import {
  CalcIrrigationRecommendationDTO,
  ICalcIrrigationRecommendationDTO,
  ISaveIrrigationRecommendationDTO,
  IUpdateIrrigationRecommendationDTO,
} from "./dto/irrigation";
import { UserIrrigationRecommendation } from "../core/model/user-irrigation-recommendation";
import { IrrigationRecommendation } from "../core/model/irrigation-recommendation";
import { setTimeout } from "node:timers/promises";

export class UserRecommendationsServices {
  static async calcBladeIrrigationRecommendation(
    command: ICalcIrrigationRecommendationDTO
  ): Promise<Either<Error, any | null>> {
    const yesterDay = getYesterDayDate("-");

    let Et0: number | null = null;

    if (Reflect.has(command.Station, "Et0")) {
      if (command.Station.Et0 === null) {
        return left(
          new Error("Não há dados de Et0 para a estação selecionada.")
        );
      }

      Et0 = command.Station.Et0 as number;
    } else {
      const lastStationMeasurements =
        await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromStation(
          command.Station.Id as number,
          yesterDay
        );

      if (lastStationMeasurements?.Et0) Et0 = lastStationMeasurements.Et0;
    }

    if (Et0 == null) {
      return left(new IrrigantErrors.StationMeasurementsNotFound());
    }

    let Precipitation: number | null = null;

    if (Reflect.has(command, "Pluviometer") == false) {
      return left(new Error("É necessário informar o atributo 'Pluviometer'"));
    }

    if (
      [
        Reflect.has(command, "Id") == false,
        Reflect.has(command, "Precipitation") == false,
      ].every((pred) => pred == false)
    ) {
      return left(
        new Error(
          "É necessário informar no atributo 'Pluviometer' o campo 'Precipitation' ou 'Id'"
        )
      );
    }
    if (Reflect.has(command.Pluviometer, "Precipitation")) {
      Precipitation = command.Pluviometer.Precipitation as number;
    } else {
      const lastPluviometerMeasurements =
        await DbEquipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
          command.Pluviometer.Id as number
        );

      if (lastPluviometerMeasurements?.Precipitation)
        Precipitation = lastPluviometerMeasurements.Precipitation;
    }

    if (Precipitation == null) {
      return left(new IrrigantErrors.PluviometerMeasurementsNotFound());
    }

    const irrigationSystemOrError = makeIrrigationSystem(command.System);

    if (irrigationSystemOrError.isLeft()) {
      return left(irrigationSystemOrError.value);
    }

    //  Valores do coeficiente de cultura (Kc) para cada fase de crescimento da cultura
    const cropCycles = await DbManagementCropRepository.findCropsCycles(
      command.CropId
    );

    if (cropCycles == null) {
      return left(new ManagementCropErrors.CropCyclesError());
    }

    const cropDate = getCropDate(command.PlantingDate);

    // Coeficiente da cultura : serve para estimar a evapotranspiração específica da cultura (ETC)
    // varia de acordo com o ciclo de crescimento da cultura
    const cycleOrError = findKc(cropDate, cropCycles);

    if (cycleOrError.isLeft()) {
      return left(cycleOrError.value);
    }

    const cropCycle = cycleOrError.value;
    const irrigationSystem =
      irrigationSystemOrError.value as IrrigationSystemEntity;

    const bladeSuggestion = BladeSuggestion.create({
      cropCycle: cropCycle as ManagementCropCycle,
      precipitation: Precipitation,
      Et0,
      irrigationSystem: irrigationSystem,
      plantingDate: command.PlantingDate,
      cropDay: cropDate,
    });

    return right({
      Etc: DecimalFormatter.truncate(bladeSuggestion.Etc, 2),
      RepositionBlade: DecimalFormatter.truncate(
        bladeSuggestion.repositionBlade,
        2
      ),
      IrrigationEfficiency: irrigationSystem.efficiency,
      IrrigationTime: bladeSuggestion.irrigationTime,
      CropDays: cropDate,
      Et0: DecimalFormatter.truncate(Et0, 2),
      Precipitation,
      Kc: bladeSuggestion.Kc,
    });
  }

  static async saveIrrigationCrops(
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

    const id = await IrrigationCropsRepository.save({
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

  // TO-DO
  static async updateIrrigationCropsById(
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

    await IrrigationCropsRepository.update({
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

  static async deleteIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, void>> {
    return right(await IrrigationCropsRepository.deleteById(id, user_id));
  }

  static async deleteAllIrrigationCrops(
    user_id: number
  ): Promise<Either<Error, void>> {
    return right(await IrrigationCropsRepository.deleteByUserId(user_id));
  }

  static async getIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>> {
    return right(await IrrigationCropsRepository.getById(id, user_id));
  }

  static async getAllIrrigationCrops(
    user_id: number
  ): Promise<Either<Error, any>> {
    return right(await IrrigationCropsRepository.getByUserId(user_id));
  }

  static async calcIrrigationRecommendationById(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>> {
    const recordedRecommendation = await IrrigationCropsRepository.getById(
      id,
      user_id
    );

    if (recordedRecommendation == null) {
      return left(new Error("Não há recomendação de lâmina cadastrada"));
    }
    // Verificar para trazer o KC da cultura na própria query de listar irrigação
    const resultOrError = await this.calcBladeIrrigationRecommendation(
      new CalcIrrigationRecommendationDTO(recordedRecommendation)
    );

    if (resultOrError.isLeft()) {
      return left(resultOrError.value);
    }

    const suggestion = resultOrError.value;

    return right({
      Id: recordedRecommendation.Id,
      CropId: recordedRecommendation.CropId,
      Crop: recordedRecommendation.Crop,
      Etc: suggestion.Etc,
      RepositionBlade: suggestion.RepositionBlade,
      IrrigationEfficiency: suggestion.IrrigationEfficiency,
      IrrigationTime: suggestion.IrrigationTime,
      CropDays: suggestion.CropDays,
      Et0: suggestion.Et0,
      Precipitation: suggestion.Precipitation,
      Kc: suggestion.Kc,
      Created_at: recordedRecommendation.CreatedAt,
      Updated_at: recordedRecommendation.UpdatedAt,
    });
  }

  // Get all irrigation crops calculated per user
  static async *calcUsersRecommendations(): AsyncGenerator<
    UserIrrigationRecommendation,
    null | undefined,
    unknown
  > {
    const users =
      await IrrigationCropsRepository.getUsersWithIrrigationReportsEnabled();

    if (users == null) return null;

    for (const user of users) {
      await setTimeout(2000);
      const irrigations = await IrrigationCropsRepository.getByUserId(user.Id);

      const userIrrigationRecommendation: UserIrrigationRecommendation =
        new UserIrrigationRecommendation({
          Email: user.Email,
          Name: user.Name,
        });

      if (irrigations == null) {
        Logger.info(
          `Não há recomendação de lâminas cadastradas para o usuário ${user.Email}`
        );

        yield userIrrigationRecommendation;
        continue;
      }

      //Calculate for each item
      for (const irrigation of irrigations) {
        // Verificar para trazer o KC da cultura na própria query de listar irrigação
        const resultOrError = await this.calcBladeIrrigationRecommendation(
          new CalcIrrigationRecommendationDTO(irrigation)
        );

        // O que fazer se der erro no cálculo da recomendação?
        if (resultOrError.isLeft()) {
          Logger.error(resultOrError.value.message);

          userIrrigationRecommendation.addIrrigation(
            new IrrigationRecommendation({
              Id: irrigation.Id,
              Crop: {
                Id: irrigation.CropId,
                Name: irrigation.Crop,
              },
              Suggestion: resultOrError.value.message,
              Created_at: irrigation.CreatedAt,
              Updated_at: irrigation.UpdatedAt,
            })
          );

          continue;
        }

        const suggestion = resultOrError.value;

        userIrrigationRecommendation.addIrrigation(
          new IrrigationRecommendation({
            Id: irrigation.Id,
            Crop: {
              Id: irrigation.CropId,
              Name: irrigation.Crop,
            },
            Suggestion: {
              Etc: suggestion.Etc,
              RepositionBlade: suggestion.RepositionBlade,
              IrrigationEfficiency: suggestion.IrrigationEfficiency,
              IrrigationTime: suggestion.IrrigationTime,
              CropDays: suggestion.CropDays,
              Et0: suggestion.Et0,
              Precipitation: suggestion.Precipitation,
              Kc: suggestion.Kc,
            },
            Created_at: irrigation.CreatedAt,
            Updated_at: irrigation.UpdatedAt,
          })
        );
      }

      yield userIrrigationRecommendation;
    }
  }
}
