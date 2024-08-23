import { setTimeout } from "timers/promises";
import { Either, left, right } from "../../../shared/Either";
import { Logger } from "../../../shared/utils/logger";
import { getYesterDayDate } from "../../../shared/utils/date";
import { DecimalFormatter } from "../../../shared/utils/decimal-formatter";
import { ManagementCropErrors } from "../core/errors/crop-errors";
import { IrrigantErrors } from "../core/errors/irrigant.error";
import { BladeSuggestion } from "../core/model/blade-suggestion";
import { getCropDate, ManagementCrop } from "../core/model/crop";
import { findKc, ManagementCropCycle } from "../core/model/crop-cycles";
import {
  IrrigationSystemEntity,
  makeIrrigationSystem,
} from "../core/model/irrigation-system";
import { UserIrrigationRecommendation } from "../core/model/user-irrigation-recommendation";
import {
  CalcIrrigationRecommendationDTO,
  ICalcIrrigationRecommendationDTO,
} from "./dto/irrigation";
import { IrrigationRecommendation } from "../core/model/irrigation-recommendation";
import { IIrrigationSuggestionServices } from "./protocols/irrigation-suggestion";
import { IEquipmentsMeasurementsRepository } from "../../Equipments/repositories/protocols/measurements";
import { IIrrigationRepository } from "../repositories/protocols/irrigation.repository";
import { IManagementCropsRepository } from "../repositories/protocols/management-crop.repository";

export class IrrigationCropsSuggestion
  implements IIrrigationSuggestionServices {
  constructor(
    private equipmentsMeasurementsRepository: IEquipmentsMeasurementsRepository,
    private cropsRepository: IManagementCropsRepository,
    private irrigationRepository: IIrrigationRepository
  ) { }

  async calculate(
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
        await this.equipmentsMeasurementsRepository.getLastMeasurementsFromStation(
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
        await this.equipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
          command.Pluviometer.Id as number
        );

      Precipitation = lastPluviometerMeasurements?.Precipitation
        ? lastPluviometerMeasurements.Precipitation
        : 0;
    }

    if (Precipitation == null) {
      return left(new IrrigantErrors.PluviometerMeasurementsNotFound());
    }

    const irrigationSystemOrError = makeIrrigationSystem(command.System);

    if (irrigationSystemOrError.isLeft()) {
      return left(irrigationSystemOrError.value);
    }

    const crop = await this.cropsRepository.findCropById(command.CropId);

    //  Valores do coeficiente de cultura (Kc) para cada fase de crescimento da cultura
    const cropCycles = await this.cropsRepository.findCropsCycles(
      command.CropId
    );

    if (cropCycles == null) {
      return left(new ManagementCropErrors.CropCyclesError());
    }

    const cropDate = getCropDate(command.PlantingDate);

    // Coeficiente da cultura : serve para estimar a evapotranspiração específica da cultura (ETC)
    // varia de acordo com o ciclo de crescimento da cultura
    const cycleOrError = findKc(
      cropDate,
      cropCycles,
      crop?.CycleRestartPoint as string
    );

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
      PlantingDate: command.PlantingDate,
      Stage: cropCycle?.Title,
      CropDays: cropDate,
      Et0: DecimalFormatter.truncate(Et0, 2),
      Precipitation,
      Kc: bladeSuggestion.Kc,
    });
  }

  async calcByIrrigationId(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>> {
    const recordedRecommendation = await this.irrigationRepository.getById(
      id,
      user_id
    );

    if (recordedRecommendation == null) {
      return left(new Error("Não há recomendação de lâmina cadastrada"));
    }
    // Verificar para trazer o KC da cultura na própria query de listar irrigação
    const resultOrError = await this.calculate(
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

  async *calPerUsers(): AsyncGenerator<
    UserIrrigationRecommendation,
    null | undefined,
    unknown
  > {
    const users =
      await this.irrigationRepository.getUsersWithIrrigationReportsEnabled();

    if (users == null) {
      Logger.info("No users found");
      return null;
    }

    for (const user of users) {
      await setTimeout(100);

      const irrigations = await this.irrigationRepository.getByUserId(user.Id);

      const userIrrigationRecommendation: UserIrrigationRecommendation =
        new UserIrrigationRecommendation({
          Email: user.Email,
          Name: user.Name,
        });

      if (irrigations == null) {
        Logger.info(
          `Não há recomendação de lâminas cadastradas para o usuário ${user.Email}`
        );

        // yield userIrrigationRecommendation;
        continue;
      }

      const hasStationWithYesterdayMeasurements =
        await this.equipmentsMeasurementsRepository.checkIfUserStationHasYesterdayEtoMeasurements(
          user.Id
        );

      if (hasStationWithYesterdayMeasurements == false) {
        userIrrigationRecommendation.setNotification(
          "Não há estação com leituras."
        );
      }

      //Calculate for each item
      for (const irrigation of irrigations) {
        // Verificar para trazer o KC da cultura na própria query de listar irrigação
        const resultOrError = await this.calculate(
          new CalcIrrigationRecommendationDTO(irrigation)
        );

        // O que fazer se der erro no cálculo da recomendação?
        if (resultOrError.isLeft()) {
          Logger.error(resultOrError.value.message);

          userIrrigationRecommendation.addIrrigation(
            new IrrigationRecommendation({
              Id: irrigation.Id,
              Name: irrigation.Name,
              Crop: {
                Id: irrigation.CropId,
                Name: irrigation.Crop,
                Etc: null,
                CropDays: null,
                IrrigationTime: null,
                Kc: null,
                RepositionBlade: null,
                PlantingDate: null,
                Stage: null,
                Warning: resultOrError.value.message,
              },
              System: {
                IrrigationEfficiency: null,
              },
              Equipments: {
                Et0: null,
                Precipitation: null,
              },
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
            Name: irrigation.Name,
            Crop: {
              Id: irrigation.CropId,
              Name: irrigation.Crop,
              Etc: suggestion.Etc,
              Kc: suggestion.Kc,
              IrrigationTime: suggestion.IrrigationTime,
              CropDays: suggestion.CropDays,
              RepositionBlade: suggestion.RepositionBlade,
              Stage: suggestion.Stage,
              PlantingDate: suggestion.PlantingDate,
            },
            Equipments: {
              Et0: suggestion.Et0,
              Precipitation: suggestion.Precipitation,
            },
            System: {
              IrrigationEfficiency: suggestion.IrrigationEfficiency,
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
