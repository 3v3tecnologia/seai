import {
  WaterSecurityRepositoryDTO,
  WaterSecurityRepositoryProtocol,
} from "../../../src/domain/use-cases/_ports/repositories/water-security.repository";

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

export class InMemoryWaterSecurityRepository
  implements WaterSecurityRepositoryProtocol
{
  private _consumers: Array<any>;

  constructor(consumes: Array<any>) {
    this._consumers = consumes || [];
  }

  async getSuperficialVolumeGroupedByProducer(
    idBasin: WaterSecurityRepositoryDTO.GetSuperficialVolumeGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetSuperficialVolumeGroupedByProducer.Response {
    throw new Error("Method not implemented.");
  }

  async getUnderGroundVolumeGroupedByProducer(
    idBasin: WaterSecurityRepositoryDTO.GetUnderGroundVolumeGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetUnderGroundVolumeGroupedByProducer.Response {
    throw new Error("Method not implemented.");
  }

  async getConsumeFromBasinGroupedByProducer(
    idBasin: WaterSecurityRepositoryDTO.GetConsumeFromBasinGroupedByProducer.Request
  ): WaterSecurityRepositoryDTO.GetConsumeFromBasinGroupedByProducer.Response {
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
