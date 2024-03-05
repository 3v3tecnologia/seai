import { ProducerRepositoryProtocol } from "../../../src/domain/use-cases/_ports/repositories/producer.repository";
import {
  ProfitabilitySecurityRepositoryDTO,
  ProfitabilitySecurityRepositoryProtocol,
} from "../../../src/domain/use-cases/_ports/repositories/profitability-security.repository";

export class InMemoryProfitabilitySecurityRepository
  implements ProfitabilitySecurityRepositoryProtocol
{
  private _profitability: Array<any>;

  constructor(profitability: Array<any>) {
    this._profitability = profitability || [];
  }

  async getByBasinGroupedByProducer(
    basinId: ProfitabilitySecurityRepositoryDTO.GetByBasinGroupedByProducer.Request
  ): ProfitabilitySecurityRepositoryDTO.GetByBasinGroupedByProducer.Response {
    const rawData = this._profitability.filter((profitability) => {
      return profitability.IdBasin == basinId;
    });

    if (!rawData.length) return null;

    const result: Map<
      number,
      ProducerRepositoryProtocol.CultureProfitabilityOutput
    > = new Map();

    rawData.forEach((raw) => {
      const culture = {
        Name: raw.Culture,
        CultivationPeriod: raw.CultivationPeriod,
        IrrigatedArea: raw.IrrigatedArea,
      };
      if (result.has(raw.IdProducer)) {
        result.get(raw.IdProducer)?.Cultures.push(culture);

        return;
      }

      result.set(raw.IdProducer, {
        Id: raw.IdProducer,
        Basin: raw.Basin,
        IdBasin: raw.IdBasin,
        Profitability: raw.TotalProfitability,
        Cultures: [culture],
      });
    });

    return Array.from(result.values());
  }
}
