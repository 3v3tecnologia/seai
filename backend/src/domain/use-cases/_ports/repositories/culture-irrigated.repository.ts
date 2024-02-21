export type ProducerCultureProfitability = {
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

export type ProducerWorkers = {
  Id: number;
  IdBasin: number;
  Basin: string;
  Workers: number;
};

export type ProducerConsumer = {
  Id: number;
  IdBasin: number;
  Basin: string;
};

export type ProducerProductivity = {
  Id: number;
  IdBasin: number;
  Basin: string;
  Productivity: number;
};

export interface ProducerRepositoryProtocol {
  getProfitabilityGroupByProducer(
    id_basin: number
  ): Promise<Array<ProducerCultureProfitability> | null>;
  getWorkers(id_basin: number): Promise<Map<number, number>>;
  getConsumer(id_basin: number): Promise<Map<number, number>>;
}
