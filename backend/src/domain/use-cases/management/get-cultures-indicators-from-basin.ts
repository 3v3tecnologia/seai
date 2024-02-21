import { Either, right } from "../../../shared/Either";
import { BasinIndicatorsByCulture } from "../../entities/management/basin-indicators-by-culture";
import { Culture } from "../../entities/management/culture";
import { Producer } from "../../entities/management/producer";
import { ProducerRepositoryProtocol } from "../_ports/repositories/culture-irrigated.repository";
import { InputWithPagination } from "../helpers/dto";

export class GetCulturesIndicatorsFromBasin
  implements GetCulturesIndicatorsFromBasinUseCaseProtocol.UseCase
{
  private repository: ProducerRepositoryProtocol;

  constructor(repository: ProducerRepositoryProtocol) {
    this.repository = repository;
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
    // const waterConsumptionByProducer = new Map<number, number>();

    const producers = result.map((producer) => {
      return new Producer(producer.Id, {
        Profitability: producer.Profitability,
        Workers: socialSecurityByProducer.get(producer.Id) || null,
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
  } & Partial<InputWithPagination>;

  export type Response = Promise<
    Either<Error, BasinIndicatorsByCulture | null>
  >;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
