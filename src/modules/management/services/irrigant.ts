import { Either, left, right } from "../../../shared/Either";
import { getYesterDayDate } from "../../../shared/utils/date";
import { DecimalFormatter } from "../../../shared/utils/decimal-formatter";
import { BladeSuggestion } from "../core/model/blade-suggestion";
import {
  IrrigationSystemEntity,
  IrrigationSystemMeasurementsTypes,
  IrrigationSystemTypes,
  irrigationsTypesNames,
} from "../core/model/irrigation-system";

import { ManagementCropErrors } from "../core/errors/crop-errors";

import { Logger } from "../../../shared/logger/logger";
import { DbEquipmentsMeasurementsRepository } from "../../equipments/repositories/equipments-measurements.repository";
import { IrrigantErrors } from "../core/errors/irrigant.error";
import { getCropDate } from "../core/model/crop";
import { ManagementCropCycle, findKc } from "../core/model/crop-cycles";
import {
  Dripping,
  DrippingProps,
  IIrrigationSystemMeasurementsEntity,
  MicroSprinkling,
  MicroSprinklingProps,
  Pivot,
  PivotProps,
  Sprinkling,
  SprinklingProps,
} from "../core/model/irrigation-system-measurements";
import { DbManagementCropRepository } from "../repositories/crop.repository";
import { IrrigationCropsRepository } from "../repositories/irrigation.repository";
import { UserIrrigantRepository } from "../repositories/user.repository";
import {
  CalcIrrigationRecommendationDTO,
  SaveIrrigationCropsDTO,
  SaveUserEquipmentsDTO,
  UpdateIrrigationCropsDTO,
  UpdateUserEquipmentsDTO,
} from "./dto/irrigant";

export class IrrigationRecommendationServices {
  static async calcBladeIrrigationRecommendation(
    command: CalcIrrigationRecommendationDTO.Input
  ): CalcIrrigationRecommendationDTO.Output {
    const yesterDay = getYesterDayDate("-");

    let Et0: number | null = null;

    if (Reflect.has(command.Station, "Et0")) {
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

    let systemOrError;

    switch (command.System.Type) {
      case irrigationsTypesNames.MicroSprinkling:
        systemOrError = MicroSprinkling.create(
          command.System.Measurements as MicroSprinklingProps
        );
        break;
      case irrigationsTypesNames.Dripping:
        systemOrError = Dripping.create(
          command.System.Measurements as DrippingProps
        );
        break;
      case irrigationsTypesNames.Sprinkling:
        systemOrError = Sprinkling.create(
          command.System.Measurements as SprinklingProps
        );
        break;
      case irrigationsTypesNames.Pivot:
        systemOrError = Pivot.create(command.System.Measurements as PivotProps);
        break;
      case irrigationsTypesNames.Sulcos:
        systemOrError = Pivot.create(command.System.Measurements as PivotProps);
        break;
      default:
        return left(new IrrigantErrors.IrrigationSystemNotRecognized());
    }

    if (systemOrError.isLeft()) {
      return left(systemOrError.value);
    }

    const irrigationSystem = new IrrigationSystemEntity({
      type: command.System.Type,
      measurements: systemOrError.value as IIrrigationSystemMeasurementsEntity,
    });

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

  //Associate equipments to User
  // The user is allowed to have only 2 equipments
  static async saveUserEquipments(
    dto: SaveUserEquipmentsDTO.Input
  ): Promise<Either<Error, string>> {
    // Shouldn't allow the user to save duplicate equipments
    await UserIrrigantRepository.removeEquipments(dto.UserId);

    // Save user equipments
    // Should get all activated equipments
    await UserIrrigantRepository.associateEquipmentsToUser({
      user_id: dto.UserId,
      pluviometer_id: dto.PluviometerId,
      station_id: dto.StationId,
    });

    return right("Sucesso ao salvar equipamentos");
  }

  static async deleteUserEquipments(
    user_id: number
  ): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await UserIrrigantRepository.removeEquipments(user_id);

    return right();
  }

  static async updateUserEquipments(
    dto: UpdateUserEquipmentsDTO.Input
  ): Promise<Either<Error, void>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    await UserIrrigantRepository.updateEquipments({
      user_id: dto.UserId,
      station_id: dto.StationId,
      pluviometer_id: dto.PluviometerId,
    });

    return right();
  }

  // Get user's equipments
  static async getUserEquipments(
    user_id: number
  ): Promise<Either<Error, Array<any>>> {
    // Save user equipments
    // Shouldn't allow the user to save duplicate equipments
    return right(await UserIrrigantRepository.getUsersEquipments(user_id));
  }

  static async saveUserIrrigationCrops(
    dto: SaveIrrigationCropsDTO.Input
  ): Promise<Either<Error, number>> {
    // Save Irrigation Crops
    let systemOrError;

    switch (dto.System.Type) {
      case irrigationsTypesNames.MicroSprinkling:
        systemOrError = MicroSprinkling.create(
          dto.System.Measurements as MicroSprinklingProps
        );
        break;
      case irrigationsTypesNames.Dripping:
        systemOrError = Dripping.create(
          dto.System.Measurements as DrippingProps
        );
        break;
      case irrigationsTypesNames.Sprinkling:
        systemOrError = Sprinkling.create(
          dto.System.Measurements as SprinklingProps
        );
        break;
      case irrigationsTypesNames.Pivot:
        systemOrError = Pivot.create(dto.System.Measurements as PivotProps);
        break;
      case irrigationsTypesNames.Sulcos:
        systemOrError = Pivot.create(dto.System.Measurements as PivotProps);
        break;
      default:
        return left(new Error("Tipo de sistema não reconhecido."));
    }

    if (systemOrError.isLeft()) {
      return left(systemOrError.value);
    }

    const systemMeasurements = (
      systemOrError.value as IIrrigationSystemMeasurementsEntity
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
  static async updateUserIrrigationCropsById(
    dto: UpdateIrrigationCropsDTO.Input
  ): Promise<Either<Error, string>> {
    // Save Irrigation Crops
    let systemOrError;

    switch (dto.System.Type) {
      case irrigationsTypesNames.MicroSprinkling:
        systemOrError = MicroSprinkling.create(
          dto.System.Measurements as MicroSprinklingProps
        );
        break;
      case irrigationsTypesNames.Dripping:
        systemOrError = Dripping.create(
          dto.System.Measurements as DrippingProps
        );
        break;
      case irrigationsTypesNames.Sprinkling:
        systemOrError = Sprinkling.create(
          dto.System.Measurements as SprinklingProps
        );
        break;
      case irrigationsTypesNames.Pivot:
        systemOrError = Pivot.create(dto.System.Measurements as PivotProps);
        break;
      case irrigationsTypesNames.Sulcos:
        systemOrError = Pivot.create(dto.System.Measurements as PivotProps);
        break;
      default:
        return left(new Error("Tipo de sistema não reconhecido."));
    }

    if (systemOrError.isLeft()) {
      return left(systemOrError.value);
    }

    const systemMeasurements = (
      systemOrError.value as IIrrigationSystemMeasurementsEntity
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

  static async deleteUserIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, void>> {
    return right(await IrrigationCropsRepository.deleteById(id, user_id));
  }

  static async deleteAllUserIrrigationCrops(
    user_id: number
  ): Promise<Either<Error, void>> {
    return right(await IrrigationCropsRepository.deleteByUserId(user_id));
  }

  static async getUserIrrigationCropsById(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>> {
    return right(await IrrigationCropsRepository.getById(id, user_id));
  }

  static async getAllUserIrrigationCrops(
    user_id: number
  ): Promise<Either<Error, any>> {
    return right(await IrrigationCropsRepository.getByUserId(user_id));
  }

  static async calcUserIrrigationRecommendationById(
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

    let systemProps: IrrigationSystemMeasurementsTypes | null = null;

    switch (recordedRecommendation.system_type) {
      case irrigationsTypesNames.MicroSprinkling:
        systemProps = {
          Area: recordedRecommendation.area as number,
          EfectiveArea: recordedRecommendation.effective_area as number,
          Flow: recordedRecommendation.flow as number,
          PlantsQtd: recordedRecommendation.plants_qtd as number,
        };
        break;
      case irrigationsTypesNames.Dripping:
        systemProps = {
          Area: recordedRecommendation.area as number,
          EfectiveArea: recordedRecommendation.effective_area as number,
          Flow: recordedRecommendation.flow as number,
          PlantsQtd: recordedRecommendation.plants_qtd as number,
        };
        break;
      case irrigationsTypesNames.Sprinkling:
        systemProps = {
          Precipitation:
            recordedRecommendation.sprinkler_precipitation as number,
        };
        break;
      case irrigationsTypesNames.Pivot:
        systemProps = {
          Precipitation:
            recordedRecommendation.sprinkler_precipitation as number,
        };
        break;
      case irrigationsTypesNames.Sulcos:
        systemProps = {
          Precipitation:
            recordedRecommendation.sprinkler_precipitation as number,
        };
        break;
      default:
        Logger.error("Tipo de sistema não reconhecido.");
        return left(new Error("Tipo de sistema não reconhecido."));
    }

    const planingDate = new Date(recordedRecommendation.planting_date);

    // DD/MM/YYYY
    const formattedDate = `${planingDate.getDate()}/${
      planingDate.getMonth() + 1
    }/${planingDate.getFullYear()}`;

    // Verificar para trazer o KC da cultura na própria query de listar irrigação
    const resultOrError = await this.calcBladeIrrigationRecommendation({
      CropId: recordedRecommendation.crop_id,
      PlantingDate: formattedDate,
      Pluviometer: {
        Id: recordedRecommendation.pluviometer_id,
      },
      Station: {
        Id: recordedRecommendation.station_id,
      },
      System: {
        Type: recordedRecommendation.system_type as IrrigationSystemTypes,
        Measurements: systemProps,
      },
    });

    // O que fazer se der erro no cálculo da recomendação?
    if (resultOrError.isLeft()) {
      Logger.error(resultOrError.value.message);
      return left(resultOrError.value);
    }

    const suggestion = resultOrError.value;

    return right({
      Id: recordedRecommendation.id,
      CropId: recordedRecommendation.crop_id,
      Crop: recordedRecommendation.crop_name,
      Etc: suggestion.Etc,
      RepositionBlade: suggestion.RepositionBlade,
      IrrigationEfficiency: suggestion.IrrigationEfficiency,
      IrrigationTime: suggestion.IrrigationTime,
      CropDays: suggestion.CropDays,
      Et0: suggestion.Et0,
      Precipitation: suggestion.Precipitation,
      Kc: suggestion.Kc,
      Created_at: recordedRecommendation.created_at,
      Updated_at: recordedRecommendation.updated_at,
    });
  }

  // Get all irrigation crops calculated by user
  static async calcAllIrrigationCropsRecommendationByUser(
    user_id: number
  ): Promise<Either<Error, Array<any>>> {
    const irrigations = await IrrigationCropsRepository.getByUserId(user_id);

    if (irrigations == null) {
      return left(new Error("Não há recomendação de lâminas cadastradas"));
    }

    const userRecommendations: Array<any> = [];
    //Calculate for each item
    for (const irrigation of irrigations) {
      let systemProps: IrrigationSystemMeasurementsTypes | null = null;

      switch (irrigation.system_type) {
        case irrigationsTypesNames.MicroSprinkling:
          systemProps = {
            Area: irrigation.area as number,
            EfectiveArea: irrigation.effective_area as number,
            Flow: irrigation.flow as number,
            PlantsQtd: irrigation.plants_qtd as number,
          };
          break;
        case irrigationsTypesNames.Dripping:
          systemProps = {
            Area: irrigation.area as number,
            EfectiveArea: irrigation.effective_area as number,
            Flow: irrigation.flow as number,
            PlantsQtd: irrigation.plants_qtd as number,
          };
          break;
        case irrigationsTypesNames.Sprinkling:
          systemProps = {
            Precipitation: irrigation.sprinkler_precipitation as number,
          };
          break;
        case irrigationsTypesNames.Pivot:
          systemProps = {
            Precipitation: irrigation.sprinkler_precipitation as number,
          };
          break;
        case irrigationsTypesNames.Sulcos:
          systemProps = {
            Precipitation: irrigation.sprinkler_precipitation as number,
          };
          break;
        default:
          Logger.error("Tipo de sistema não reconhecido.");
      }

      // Se o tipo de sistema estiver inválido
      if (!systemProps) {
        continue;
      }

      const planingDate = new Date(irrigation.planting_date);

      // DD/MM/YYYY
      const formattedDate = `${planingDate.getDate()}/${
        planingDate.getMonth() + 1
      }/${planingDate.getFullYear()}`;

      // Verificar para trazer o KC da cultura na própria query de listar irrigação
      const resultOrError = await this.calcBladeIrrigationRecommendation({
        CropId: irrigation.crop_id,
        PlantingDate: formattedDate,
        Pluviometer: {
          Id: irrigation.pluviometer_id,
        },
        Station: {
          Id: irrigation.station_id,
        },
        System: {
          Type: irrigation.system_type as IrrigationSystemTypes,
          Measurements: systemProps,
        },
      });

      // O que fazer se der erro no cálculo da recomendação?
      if (resultOrError.isLeft()) {
        Logger.error(resultOrError.value.message);
        userRecommendations.push({
          Id: irrigation.id,
          CropId: irrigation.crop_id,
          Crop: irrigation.crop_name,
          Etc: null,
          RepositionBlade: null,
          IrrigationEfficiency: null,
          IrrigationTime: null,
          CropDays: null,
          Et0: null,
          Precipitation: null,
          Kc: null,
          Created_at: irrigation.created_at,
          Updated_at: irrigation.updated_at,
        });
        continue;
      }

      const suggestion = resultOrError.value;

      userRecommendations.push({
        Id: irrigation.id,
        CropId: irrigation.crop_id,
        Crop: irrigation.crop_name,
        Etc: suggestion.Etc,
        RepositionBlade: suggestion.RepositionBlade,
        IrrigationEfficiency: suggestion.IrrigationEfficiency,
        IrrigationTime: suggestion.IrrigationTime,
        CropDays: suggestion.CropDays,
        Et0: suggestion.Et0,
        Precipitation: suggestion.Precipitation,
        Kc: suggestion.Kc,
        Created_at: irrigation.created_at,
        Updated_at: irrigation.updated_at,
      });
    }

    return right(userRecommendations);
  }
}
