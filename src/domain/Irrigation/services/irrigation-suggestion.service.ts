import { setTimeout } from "timers/promises";
import { Either, left, right } from "../../../shared/Either";
import { getYesterDayDate } from "../../../shared/utils/date";
import { Logger } from "../../../shared/utils/logger";
import { ManagementCropErrors } from "../../Crop/core/crop-errors";
import { IrrigantErrors } from "../core/errors/irrigant.error";
import { calcIrrigationRecommendation, IrrigationRecommendationData } from "../core/model/calc-recommendation";

import {
  IrrigationSystem,
  makeIrrigationSystem,
} from "../core/model/irrigation-system";
import { IrrigationRecommendationReports } from "../core/model/irrigation-reports";
import {
  UserIrrigationPreferences,
} from "./dto/irrigation-recommendation";
import { IIrrigationSuggestionServices } from "./protocols/irrigation-suggestion";
import { IEquipmentsMeasurementsRepository } from "../../Equipments/infra/repository/protocols/measurements";
import { IManagementCropsRepository } from "../../Crop/infra/repository/protocol/management-crop.repository";
import { IUserIrrigationPreferencesRepository } from "../infra/repository/protocols/irrigation.repository";

export class IrrigationCropsSuggestion
  implements IIrrigationSuggestionServices {
  constructor(
    private equipmentsMeasurementsRepository: IEquipmentsMeasurementsRepository,
    private cropsRepository: IManagementCropsRepository,
    private irrigationRepository: IUserIrrigationPreferencesRepository
  ) { }


  private async getPrecipitation(command: UserIrrigationPreferences): Promise<Either<Error, number>> {
    if (Reflect.has(command, "Pluviometer") == false) {
      return left(new Error("É necessário informar medição para equipamento Pluviômetro"));
    }

    if (Reflect.has(command.Pluviometer, "Precipitation")) {
      return right(command.Pluviometer.Precipitation as number)
    }

    if (Reflect.has(command.Pluviometer, "Id")) {
      const lastPluviometerMeasurements =
        await this.equipmentsMeasurementsRepository.getLastMeasurementsFromPluviometer(
          command.Pluviometer.Id as number
        );

      const data = lastPluviometerMeasurements?.Precipitation
        ? lastPluviometerMeasurements.Precipitation
        : 0;

      return right(data)
    }


    return left(
      new Error(
        "É necessário informar a 'precipitação' ou 'id' do pluviômetro"
      )
    );
  }

  private async getEt0(command: UserIrrigationPreferences): Promise<Either<Error, number>> {

    if (Reflect.has(command.Station, "Et0")) {
      if (command.Station.Et0 === null) {
        return left(
          new Error("Não há dados de Et0 para a estação selecionada.")
        );
      }

      return right(command.Station.Et0 as number)

    }


    const yesterDay = getYesterDayDate("-");

    const lastStationMeasurements =
      await this.equipmentsMeasurementsRepository.getLastMeasurementsFromStation(
        command.Station.Id as number,
        yesterDay
      );

    if (lastStationMeasurements == null) return left(new IrrigantErrors.StationMeasurementsNotFound())

    return right(lastStationMeasurements.Et0)
  }

  async calculate(
    command: UserIrrigationPreferences
  ): Promise<Either<Error, any | null>> {

    const EtoOrError = await this.getEt0(command)

    if (EtoOrError.isLeft()) {
      return left(EtoOrError.value)
    }

    const Et0 = EtoOrError.value as number

    let precipitationOrError = await this.getPrecipitation(command)

    if (precipitationOrError.isLeft()) {
      return left(precipitationOrError.value)
    }

    const precipitation = precipitationOrError.value as number

    if (command.CropId === null) {
      return left(new Error("Identificador da Cultura não informada."))
    }

    const crop = await this.cropsRepository.findCropById(command.CropId);

    if (crop == null) {
      return left(new ManagementCropErrors.CropCyclesError());
    }

    const irrigationSystemOrError = makeIrrigationSystem(command.System);

    if (irrigationSystemOrError.isLeft()) {
      return left(irrigationSystemOrError.value);
    }

    const irrigationSystem = irrigationSystemOrError.value as IrrigationSystem


    const recommendationOrError = calcIrrigationRecommendation({
      crop,
      Et0,
      precipitation,
      irrigationSystem,
      plantingDate: command.PlantingDate,
    })

    if (recommendationOrError.isLeft()) {
      return left(recommendationOrError.value)
    }

    const recommendation = recommendationOrError.value as IrrigationRecommendationData

    return right(recommendation);
  }

  async calcByIrrigationId(
    id: number,
    user_id: number
  ): Promise<Either<Error, any>> {
    const userIrrigation = await this.irrigationRepository.getById(
      id,
      user_id
    );

    if (userIrrigation == null) {
      return left(new Error("Não há recomendação de lâmina cadastrada"));
    }
    // Verificar para trazer o KC da cultura na própria query de listar irrigação
    const resultOrError = await this.calculate(
      userIrrigation
    );

    if (resultOrError.isLeft()) {
      return left(resultOrError.value);
    }

    const suggestion = resultOrError.value;

    const { Id, CropId, Crop, CreatedAt, UpdatedAt } = userIrrigation

    return right({
      Id,
      CropId,
      Crop,
      Created_at: CreatedAt,
      Updated_at: UpdatedAt,
      ...suggestion,
    });
  }

  async *calPerUsers(): AsyncGenerator<
    IrrigationRecommendationReports,
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

      const userIrrigationRecommendation =
        new IrrigationRecommendationReports({
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
          "Não foi possível realizar a coleta de dados na estação meteorológica selecionada para o dia de hoje. Para visualizar as recomendações de lâmina de irrigação atualizadas, selecione outra estação meteorológica na aba de configurações e, em seguida, consulte as recomendações disponíveis na seção 'Áreas de Plantio'."
        );
      }

      //Calculate for each item
      for (const irrigation of irrigations) {
        // Verificar para trazer o KC da cultura na própria query de listar irrigação
        const resultOrError = await this.calculate(
          irrigation
        );

        // O que fazer se der erro no cálculo da recomendação?
        if (resultOrError.isLeft()) {
          Logger.error(resultOrError.value.message);

          userIrrigationRecommendation.addIrrigation(
            {
              Id: irrigation.Id as number,
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
              Created_at: irrigation.CreatedAt as string,
              Updated_at: irrigation.UpdatedAt as string,
            }
          );

          continue;
        }

        const suggestion = resultOrError.value;

        userIrrigationRecommendation.addIrrigation(
          {
            Id: irrigation.Id as number,
            Name: irrigation.Name,
            Crop: {
              Id: irrigation.CropId as number,
              Name: irrigation.Crop as string,
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
            Created_at: irrigation.CreatedAt as string,
            Updated_at: irrigation.UpdatedAt as string,
          }
        );
      }

      yield userIrrigationRecommendation;
    }
  }
}
