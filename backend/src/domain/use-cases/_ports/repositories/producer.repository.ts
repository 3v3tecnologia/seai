export namespace ProducerRepositoryProtocol {
  export type CultureProfitabilityOutput = {
    Id: number;
    Profitability: number; // Total
    IdBasin: number;
    Basin: string;
    Cultures: Array<{
      Name: string;
      IrrigatedArea: number;
      CultivationPeriod: number;
    }>;
  };

  export type WorkersOutput = Map<
    number,
    {
      IdBasin: number;
      Workers: number;
    }
  >;

  // export type ProducerConsumer = {
  //   Id: number;
  //   IdBasin: number;
  //   Basin: string;
  // };

  export type ProducerProductivity = {
    Id: number;
    IdBasin: number;
    Basin: string;
    Productivity: number;
  };

  export type VolumeByProducerOutput = Array<{
    Register: number;
    IdBasin: number;
    Volume: number;
  }>;

  export type ConsumeOutput = Map<
    number,
    {
      IdBasin: number;
      Volumes: Array<number>;
      Consume: number;
    }
  >;

  export interface Repository {
    getProfitabilityGroupByProducer(
      basinId: number
    ): Promise<Array<CultureProfitabilityOutput> | null>;
    getWorkers(basinId: number): Promise<WorkersOutput | null>;
    getSuperficialVolume(
      basinId: number
    ): Promise<VolumeByProducerOutput | null>;
    getUnderGroundVolume(
      basinId: number
    ): Promise<VolumeByProducerOutput | null>;
    getConsume(basinId: number): Promise<ConsumeOutput>;
  }
}
