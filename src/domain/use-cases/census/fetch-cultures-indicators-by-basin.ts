import { Either, right } from "../../../shared/Either";
import { ManagementStudiesRepository } from "../../../v2/management/ports/studies/repository";
import { BasinIndicatorsByCulture } from "../../entities/management/basin-indicators-by-culture";
import { Culture } from "../../entities/management/culture";
import { Producer } from "../../entities/management/producer";

import { ProfitabilitySecurityRepositoryProtocol } from "../_ports/repositories/profitability-security.repository";
import { WaterSecurityRepositoryProtocol } from "../_ports/repositories/water-security.repository";
import { WorkersSecurityRepositoryProtocol } from "../_ports/repositories/workers-security.repository";

export class GetCulturesIndicatorsFromBasin
  implements GetCulturesIndicatorsFromBasinUseCaseProtocol.UseCase
{
  private economicSecurityRepository: ProfitabilitySecurityRepositoryProtocol;
  private socialSecurityRepository: WorkersSecurityRepositoryProtocol;
  private waterSecurityRepository: WaterSecurityRepositoryProtocol;
  private managementStudiesRepository: ManagementStudiesRepository;

  constructor(
    economicSecurityRepository: ProfitabilitySecurityRepositoryProtocol,
    socialSecurityRepository: WorkersSecurityRepositoryProtocol,
    waterSecurityRepository: WaterSecurityRepositoryProtocol,
    studiesRepository: ManagementStudiesRepository
  ) {
    this.economicSecurityRepository = economicSecurityRepository;
    this.socialSecurityRepository = socialSecurityRepository;
    this.waterSecurityRepository = waterSecurityRepository;
    this.managementStudiesRepository = studiesRepository;
  }

  async execute(
    request: GetCulturesIndicatorsFromBasinUseCaseProtocol.Request
  ): GetCulturesIndicatorsFromBasinUseCaseProtocol.Response {
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
      for (const [study, value] of studiesProductivity) {
        const culture = basinIndicators.Cultures?.get(study);

        if (culture) {
          const averageStudyProductivity =
            Number(value.Productivity) / Number(value.Consumption);

          culture.ProductivityPerHectare =
            culture.Consumption * averageStudyProductivity;
        }
      }
    }

    return right(basinIndicators);
  }
}

export namespace GetCulturesIndicatorsFromBasinUseCaseProtocol {
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
