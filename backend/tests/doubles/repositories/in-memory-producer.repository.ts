import { ProducerRepositoryProtocol } from "../../../src/domain/use-cases/_ports/repositories/producer.repository";

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

export class InMemoryProducerRepository
  implements ProducerRepositoryProtocol.Repository
{
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

  getSuperficialVolume(
    basinId: number
  ): Promise<ProducerRepositoryProtocol.VolumeByProducerOutput | null> {
    throw new Error("Method not implemented.");
  }

  getUnderGroundVolume(
    basinId: number
  ): Promise<ProducerRepositoryProtocol.VolumeByProducerOutput | null> {
    throw new Error("Method not implemented.");
  }

  async getProfitabilityGroupByProducer(
    id_basin: number
  ): Promise<Array<ProducerRepositoryProtocol.CultureProfitabilityOutput> | null> {
    const rawData = this._profitability.filter((profitability) => {
      return profitability.IdBasin == id_basin;
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

  async getWorkers(id_basin: number): Promise<
    Map<
      number,
      {
        IdBasin: number;
        Workers: number;
      }
    >
  > {
    return new Map<
      number,
      {
        IdBasin: number;
        Workers: number;
      }
    >([
      [
        1667322811535,
        {
          IdBasin: 1,
          Workers: 20,
        },
      ],
      [
        1667328714161,
        {
          IdBasin: 1,
          Workers: 2,
        },
      ],
    ]);
  }
  async getConsume(
    id_basin: number
  ): Promise<ProducerRepositoryProtocol.ConsumeOutput> {
    return new Map<
      number,
      {
        IdBasin: number;
        Volumes: Array<number>;
        Consume: number;
      }
    >([
      [
        1674825556279,
        {
          IdBasin: 1,
          Consume: 8064,
          Volumes: [10, 10],
        },
      ],
      [
        1674912212406,
        {
          IdBasin: 1,
          Consume: 10368,
          Volumes: [1, 1],
        },
      ],
    ]);
  }
}
