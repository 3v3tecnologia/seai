import { Either, right } from "../../../../shared/Either";
import { BasinIndicatorsByCulture } from "../../../../domain/entities/management/basin-indicators-by-culture";
import { Culture } from "../../../../domain/entities/management/culture";
import { Producer } from "../../../../domain/entities/management/producer";

import { ProfitabilitySecurityRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/profitability-security.repository";
import { WaterSecurityRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/water-security.repository";
import { WorkersSecurityRepositoryProtocol } from "../../../../domain/use-cases/_ports/repositories/workers-security.repository";
import { ICensusStudiesRepository } from "../../studies/repositories/protocol/repository";

export class GetCropsIndicatorsFromBasin
  implements GetCropsIndicatorsFromBasinUseCaseProtocol.UseCase {
  private economicSecurityRepository: ProfitabilitySecurityRepositoryProtocol;
  private socialSecurityRepository: WorkersSecurityRepositoryProtocol;
  private waterSecurityRepository: WaterSecurityRepositoryProtocol;
  private managementStudiesRepository: ICensusStudiesRepository;

  constructor(
    economicSecurityRepository: ProfitabilitySecurityRepositoryProtocol,
    socialSecurityRepository: WorkersSecurityRepositoryProtocol,
    waterSecurityRepository: WaterSecurityRepositoryProtocol,
    studiesRepository: ICensusStudiesRepository
  ) {
    this.economicSecurityRepository = economicSecurityRepository;
    this.socialSecurityRepository = socialSecurityRepository;
    this.waterSecurityRepository = waterSecurityRepository;
    this.managementStudiesRepository = studiesRepository;
  }

  async execute(
    request: GetCropsIndicatorsFromBasinUseCaseProtocol.Request
  ): GetCropsIndicatorsFromBasinUseCaseProtocol.Response {
    const profitability =
      await this.economicSecurityRepository.getByBasinGroupedByProducer(
        request.IdBasin
      );

    if (profitability === null) {
      return right(null);
    }

    // Social indicator by producer
    const socialSecurityByProducer =
      await this.socialSecurityRepository.getByBasinGroupedByProducer(
        request.IdBasin
      );

    // Superficial + Subterrâneo
    const waterConsumptionByProducer =
      await this.waterSecurityRepository.getConsumeFromBasinGroupedByProducer(
        request.IdBasin
      );

    const studiesProductivity =
      await this.managementStudiesRepository.getByBasin(request.IdBasin);

    const producers = profitability.map((producer) => {
      let workers = null;
      let waterConsumption = null;

      if (
        socialSecurityByProducer &&
        socialSecurityByProducer.has(producer.Id)
      ) {
        const worker = socialSecurityByProducer.get(producer.Id);

        if (worker) {
          workers = worker.Workers;
        }
      }

      if (
        waterConsumptionByProducer &&
        waterConsumptionByProducer.has(producer.Id)
      ) {
        const consumption = waterConsumptionByProducer.get(producer.Id);

        if (consumption) {
          waterConsumption = consumption.Consume;
        }
      }

      return new Producer(producer.Id, {
        Profitability: producer.Profitability,
        Workers: workers,
        WaterConsumption: waterConsumption,
        Productivity: null,
        Cultures: producer.Cultures.map(
          (culture) =>
            new Culture(culture.Name, {
              CultivationPeriod: culture.CultivationPeriod,
              IrrigatedArea: culture.IrrigatedArea,
              Profitability: producer.Profitability,
            })
        ),
      });
    });

    const basinIndicators = new BasinIndicatorsByCulture({
      id: request.IdBasin,
      producers,
    });

    if (studiesProductivity) {
      for (const [study, value] of Object.entries(studiesProductivity)) {
        const culture = basinIndicators.Cultures?.get(study);

        if (culture) {
          const averageStudyProductivity =
            Number(value.productivity) / Number(value.consumption);

          culture.ProductivityPerHectare =
            culture.Consumption * averageStudyProductivity;
        }
      }
    }

    return right(basinIndicators);
  }
}

export namespace GetCropsIndicatorsFromBasinUseCaseProtocol {
  export type Request = {
    IdBasin: number;
  };

  export type Response = Promise<
    Either<Error, BasinIndicatorsByCulture | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
