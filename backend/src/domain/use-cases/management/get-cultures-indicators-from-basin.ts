import { Either, right } from "../../../shared/Either";
import { BasinIndicatorsByCulture } from "../../entities/management/basin-indicators-by-culture";
import { Culture } from "../../entities/management/culture";
import { Producer } from "../../entities/management/producer";
import { ManagementStudiesRepositoryProtocol } from "../_ports/repositories/management-studies.repository";
import { ProducerRepositoryProtocol } from "../_ports/repositories/producer.repository";
import { InputWithPagination } from "../helpers/dto";

export class GetCulturesIndicatorsFromBasin
  implements GetCulturesIndicatorsFromBasinUseCaseProtocol.UseCase
{
  private repository: ProducerRepositoryProtocol.Repository;
  // private studiesRepository: ManagementStudiesRepositoryProtocol;

  constructor(
    repository: ProducerRepositoryProtocol.Repository
    // studiesRepository: ManagementStudiesRepositoryProtocol
  ) {
    this.repository = repository;
    // this.studiesRepository = studiesRepository;
  }

  async execute(
    request: GetCulturesIndicatorsFromBasinUseCaseProtocol.Request
  ): GetCulturesIndicatorsFromBasinUseCaseProtocol.Response {
    const result = await this.repository.getProfitabilityGroupByProducer(
      request.IdBasin
    );

    if (result === null) {
      return right(null);
    }

    // Social indicator by producer
    const socialSecurityByProducer = await this.repository.getWorkers(
      request.IdBasin
    );

    // Superficial + Subterrâneo
    const waterConsumptionByProducer = await this.repository.getConsume(
      request.IdBasin
    );

    const producers = result.map((producer) => {
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
