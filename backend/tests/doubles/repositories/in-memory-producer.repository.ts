import {
  ProducerRepositoryProtocol,
  ProducerCultureProfitability,
} from "../../../src/domain/use-cases/_ports/repositories/culture-irrigated.repository";

type RawProducerProfitability = {
  IdProducer: number;
  IdCulture: number;
  Culture: string;
  IdBasin: number;
  Basin: string;
  IrrigatedArea: number;
  CultivationPeriod: number;
  TotalProfitability: number;
};

export class InMemoryProducerRepository implements ProducerRepositoryProtocol {
  private _profitability: Array<RawProducerProfitability> = [];
  private _workers: Array<any>;
  private _consumers: Array<any>;

  constructor(props: {
    profitability: Array<RawProducerProfitability>;
    workers?: Array<any>;
    consumers?: Array<any>;
  }) {
    this._profitability = props.profitability;
    this._workers = props.workers || [];
    this._consumers = props.consumers || [];
  }

  async getProfitabilityGroupByProducer(
    id_basin: number
  ): Promise<Array<ProducerCultureProfitability> | null> {
    const rawData = this._profitability.filter((profitability) => {
      return profitability.IdBasin == id_basin;
    });

    if (!rawData.length) return null;

    const result: Map<number, ProducerCultureProfitability> = new Map();

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

  async getWorkers(id_basin: number): Promise<Map<number, number>> {
    return new Map<number, number>([
      [1667322811535, 20],
      [1667328714161, 2],
    ]);
  }
  async getConsumer(id_basin: number): Promise<Map<number, number>> {
    return new Map<number, number>([
      [1667322811535, 20],
      [1667328714161, 2],
    ]);
  }
}
